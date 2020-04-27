import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { JsonRpcProvider } from 'ethers/providers';

import { ACCOUNTS, makeSigner } from '@augurproject/tools';
import { buildConfig } from '@augurproject/artifacts';
import { Augur, Connectors, MarketReportingState } from '@augurproject/sdk';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { MarketList } from '@augurproject/sdk/build/state/getter/Markets';
import { sleep } from '@augurproject/sdk/build/state/utils/utils';

import { createClient, startServerFromClient } from "@augurproject/sdk/build";
import { TestNetReputationToken } from "@augurproject/core/build/libraries/ContractInterfaces";

const MAX_APPROVAL = new BigNumber(2).pow(256).minus(1);
async function approve(augur: Augur, wei=MAX_APPROVAL): Promise<void> {
  const authority = augur.config.addresses.Augur;
  await augur.contracts.cash.approve(authority, wei);

  const fillOrder = augur.config.addresses.FillOrder;
  await augur.contracts.cash.approve(fillOrder, wei);
  await augur.contracts.shareToken.setApprovalForAll(fillOrder, true);

  const createOrder = augur.config.addresses.CreateOrder;
  await augur.contracts.cash.approve(createOrder, wei);
  await augur.contracts.shareToken.setApprovalForAll(createOrder, true);

  const zeroXTrade = augur.config.addresses.ZeroXTrade;
  await augur.contracts.cash.approve(zeroXTrade, wei);
}

describe('robert', () => {
  test('zerion', async () => {
    console.log('Setting up users');
    // Config files are found in packages/augur-artifacts/src/environments
    const config = buildConfig('local', {
      gsn: { enabled: true },
      zeroX: { rpc: { enabled: true }},
    });
    const provider = new EthersProvider(
      new JsonRpcProvider(config.ethereum.http),
      config.ethereum.rpcRetryCount,
      config.ethereum.rpcRetryInterval,
      config.ethereum.rpcConcurrency
    );
    const connector = new Connectors.DirectConnector();
    const marketMaker = await createClient(config, connector, await makeSigner(ACCOUNTS[0], provider), provider);
    const maker = await createClient(config, connector, await makeSigner(ACCOUNTS[1], provider), provider);
    const taker = await createClient(config, connector, await makeSigner(ACCOUNTS[2], provider), provider);
    const api = await startServerFromClient(config, marketMaker);
    connector.initialize(marketMaker, await api.db);

    console.log('Use a wallet and the GSN relay');
    marketMaker.setUseWallet(true);
    marketMaker.setUseRelay(true);
    maker.setUseWallet(true);
    maker.setUseRelay(true);
    taker.setUseWallet(true);
    taker.setUseRelay(true);

    console.log('Approve transfer of all related tokens');
    await approve(marketMaker);
    await approve(maker);
    await approve(taker);

    const makerAccount = await maker.getAccount();
    const takerAccount = await taker.getAccount();
    const universe = marketMaker.config.addresses.Universe;

    console.log('Fauceting some DAI for market creation');
    const marketCreationFee = await marketMaker.contracts.universe.getOrCacheValidityBond_();
    await marketMaker.contracts.cashFaucet.faucet(marketCreationFee);

    console.log('Fauceting some REP for market creation');
    const repBond = await marketMaker.contracts.universe.getOrCacheMarketRepBond_();
    await (await marketMaker.contracts.getReputationToken() as TestNetReputationToken).faucet(repBond.plus(1e18));

    console.log('Creating market');
    const currentTimestamp = (await marketMaker.getTimestamp()).toNumber();
    const designatedReporter = ACCOUNTS[0].address;
    const marketContract = await marketMaker.createYesNoMarket({
      endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
      feePerCashInAttoCash: new BigNumber(1e16), // 1%
      affiliateFeeDivisor: new BigNumber(25),
      designatedReporter,
      extraInfo: JSON.stringify({
        categories: ['Zerion', 'Reasonable', 'YesNo'],
        description: 'A simple yes/no market for showing off Augur.',
      }),
    });

    console.log('Syncing the database with the blockchain via the provider');
    await (await api.db).sync();

    console.log('Querying for markets');
    const markets: MarketList = await marketMaker.getMarkets({
      universe,
      includeWarpSyncMarkets: false,
      reportingStates: [MarketReportingState.PreReporting],
      // Can specify other constraints like max liquidity spread and filtering out invalid markets.
    });
    console.log('MARKETS', JSON.stringify(markets))
    const market = markets.markets.find((m) => m.id === marketContract.address);

    console.log('MARKET', market.id)

    console.log('Faucet for trading');
    // Once you enable GSN, the Augur wallet is used. But the DAI used by 0x resides in your signing wallet.
    // So for 0x orders, you have to faucet using the signing wallet.
    await maker.contracts.cashFaucet.faucet(new BigNumber(100e18), { sender: ACCOUNTS[1].address });

    console.log('Create an order');
    const tradeGroupId = '42'; // not strictly necessary. value is arbitrary
    const fingerprint = formatBytes32String('11'); // for affiliate functionality. not strictly necessary. value is arbitrary
    const expirationTime = new BigNumber(new Date().valueOf()).plus(1000000); // in the future a ways
    await maker.placeTrade({
      doNotCreateOrders: false, // must create an order - won't take if another exists
      direction: 0, // 0=bid, 1=ask
      market: market.id,
      numTicks: new BigNumber(market.numTicks),
      numOutcomes: 3,//market.numOutcomes,
      outcome: 1, // 0=invalid (market will resolve as invalid), 1-7 are valid outcomes whose meaning depends on the market
      tradeGroupId,
      fingerprint,
      displayMinPrice: new BigNumber(market.minPrice),
      displayMaxPrice: new BigNumber(market.maxPrice),
      displayAmount: new BigNumber(10), // buy 10 shares
      displayPrice: new BigNumber(0.1), // 10 cents per share
      displayShares: new BigNumber(0), // user doesn't have any shares they could pay with instead of using DAI
      expirationTime,
    });

    console.log('Wait for 0x order to propagate');
    await sleep(5000);
    await (await api.db).sync(); // TODO necessary here?

    // Get a user's positions and potential profit from those positions. (Is potential profit just at the current time? Like derived from latest price.)

    const positions = await maker.getUserTradingPositions({ account: makerAccount , universe });
    console.log('POSITIONS', JSON.stringify(positions, null, 2));

    const profitLossSummary = await maker.getProfitLossSummary({ account: makerAccount, universe });
    console.log('PL', JSON.stringify(profitLossSummary, null, 2));

    const orders = await maker.getZeroXOrders({ marketId: market.id });
    console.log('ORDERS', JSON.stringify(orders, null, 2));

    // Take an existing order at market price. Does not create new orders.
    const numShares = new BigNumber(10); // 10 shares - would be 10e18 but numShares for place is "display shares" not "atto shares"

    console.log('Take a specific order');
    await taker.contracts.fillOrder.publicFillOrder(
      'id taken from 0x',
      numShares.times(1e18), // numShares here is in attoShares
      tradeGroupId,
      fingerprint,
    );


    // take any orders it can, without creating any new ones
    console.log('Create an order');
    await marketMaker.placeTrade({
      doNotCreateOrders: true, // will only take orders, never create new ones
      direction: 0, // 0=bid, 1=ask
      market: market.id,
      numTicks: new BigNumber(market.numTicks),
      numOutcomes: 3,//market.numOutcomes,
      outcome: 1, // 0=invalid (market will resolve as invalid), 1-7 are valid outcomes whose meaning depends on the market
      tradeGroupId: '42',
      fingerprint,
      displayMinPrice: new BigNumber(market.minPrice),
      displayMaxPrice: new BigNumber(market.maxPrice),
      displayAmount: numShares,
      displayPrice: new BigNumber(0.1), // 10 cents per share or better
      displayShares: new BigNumber(0), // user doesn't have any shares they could pay with instead of using DAI
      expirationTime,
    });


    // Cashout: sell entire position at market price, if orderbook is deep enough

    // await sleep(30 * 1000); // wait for 0x orders to propagate
    // const orders = await marketMaker.getZeroXOrders({ marketId: market.id });

    // console.log('ORDERS', JSON.stringify(orders, null, 2));

    // Get 0x orderbook for augur. Other methods do this in the backend but perhaps the users want to see the orderbook itself?
  });
});
