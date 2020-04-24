import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { JsonRpcProvider } from 'ethers/providers';

// import { ACCOUNTS, makeSigner } from '@augurproject/tools';
import { ACCOUNTS, makeSigner } from '.';
import { buildConfig } from '@augurproject/artifacts';
import { Connectors, MarketReportingState, createClient, startServerFromClient } from '@augurproject/sdk';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { sleep } from '@augurproject/sdk/build/state/utils/utils';
import { TestNetReputationToken } from "@augurproject/core/build/libraries/ContractInterfaces";

async function main() {
  console.log('Setting up users');
  // Config files are found in packages/augur-artifacts/src/environments
  // The local.json config file is created when you run `yarn docker:all` to start up the testing environment.
  const config = buildConfig('local', {
    gsn: { enabled: true },
    zeroX: { rpc: { enabled: true } },
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

  const marketMakerAccount = await marketMaker.getAccount();
  const makerAccount = await maker.getAccount();
  const takerAccount = await taker.getAccount();
  const universe = marketMaker.config.addresses.Universe;

  console.log('Fauceting some DAI for market creation');
  const marketCreationFee = await marketMaker.contracts.universe.getOrCacheValidityBond_();
  await marketMaker.contracts.cashFaucet.faucet(marketCreationFee);

  console.log('Fauceting some REP for market creation');
  const repBond = await marketMaker.contracts.universe.getOrCacheMarketRepBond_();
  await(await marketMaker.contracts.getReputationToken() as TestNetReputationToken).faucet(repBond.plus(1e18));

  console.log('Creating market');
  const currentTimestamp = (await marketMaker.getTimestamp()).toNumber();
  const marketContract = await marketMaker.createYesNoMarket({
    endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
    feePerCashInAttoCash: new BigNumber(1e16), // 1%
    affiliateFeeDivisor: new BigNumber(25), // 4%
    designatedReporter: marketMakerAccount,
    extraInfo: JSON.stringify({
      categories: ['Zerion', 'Reasonable', 'YesNo'],
      description: 'A simple yes/no market for showing off Augur.',
    }),
  });

  console.log('Syncing the database with the blockchain via the provider');
  await sleep(2000); // wait a bit for geth to build the block
  await(await api.db).sync();

  console.log('Querying for markets');
  const markets = await marketMaker.getMarkets({
    universe,
    includeWarpSyncMarkets: false,
    reportingStates: [MarketReportingState.PreReporting],
    // Can specify other constraints like max liquidity spread and filtering out invalid markets.
  });
  // Find the market we just created
  const market = markets.markets.find((m) => m.id === marketContract.address);

  console.log('Faucet 100 DAI for trading');
  await maker.contracts.cashFaucet.faucet(new BigNumber(100e18), { sender: ACCOUNTS[1].address });
  await taker.contracts.cashFaucet.faucet(new BigNumber(100e18), { sender: ACCOUNTS[2].address });

  console.log('Make an order');
  const tradeGroupId = formatBytes32String('42'); // value is arbitrary
  const fingerprint = formatBytes32String('11'); // for affiliate functionality. value is arbitrary
  const expirationTime = new BigNumber(new Date().valueOf()).plus(1000000); // in the future a ways
  await maker.placeTrade({
    doNotCreateOrders: false, // will make an order if it can't take enough to cover the amount and price
    direction: 0, // 0=bid, 1=ask
    outcome: 1, // 0=invalid (market will resolve as invalid), 1-7 are valid outcomes whose meaning depends on the market
    displayAmount: new BigNumber(10), // buy 10 shares
    displayPrice: new BigNumber(0.1), // 10 cents per share
    displayShares: new BigNumber(0), // user doesn't have any shares they could pay with instead of using DAI
    market: market.id,
    displayMinPrice: new BigNumber(market.minPrice),
    displayMaxPrice: new BigNumber(market.maxPrice),
    numTicks: new BigNumber(market.numTicks),
    numOutcomes: market.numOutcomes,
    tradeGroupId,
    fingerprint,
    expirationTime,
  });

  console.log('Wait for 0x order to propagate');
  await sleep(1000);

  console.log("Get a user's positions and potential profit from those positions.");
  let positions = await maker.getUserTradingPositions({ account: makerAccount, universe });
  console.log('Positions:', JSON.stringify(positions, null, 2));
  let profitLossSummary = await maker.getProfitLossSummary({ account: makerAccount, universe });
  console.log('Profit/Loss:', JSON.stringify(profitLossSummary, null, 2));

  // Orders data structure: market -> outcome -> direction -> [order]
  let orders = await maker.getZeroXOrders({ marketId: market.id });
  console.log('All Orders for market:', JSON.stringify(orders, null, 2));
  orders = await maker.getZeroXOrders({ account: makerAccount });
  console.log('All Orders for user:', JSON.stringify(orders, null, 2));

  console.log('Take an existing order at market price. Does not create a new order.');
  await taker.placeTrade({
    doNotCreateOrders: true, // will not make an order: it will take what it can then give up
    direction: 1, // 0=bid, 1=ask ; taking the other direction to make the order created by the maker earlier
    outcome: 1, // 0=invalid (market will resolve as invalid), 1-7 are valid outcomes whose meaning depends on the market
    displayAmount: new BigNumber(20), // buy 10 shares
    displayPrice: new BigNumber(0.1), // 10 cents per share
    displayShares: new BigNumber(0), // user doesn't have any shares they could pay with instead of using DAI
    market: market.id,
    displayMinPrice: new BigNumber(market.minPrice),
    displayMaxPrice: new BigNumber(market.maxPrice),
    numTicks: new BigNumber(market.numTicks),
    numOutcomes: market.numOutcomes,
    tradeGroupId,
    fingerprint,
    expirationTime,
  });

  console.log('Syncing the database with the blockchain via the provider');
  await sleep(2000); // wait a bit for geth to build the block
  await(await api.db).sync();

  console.log("Get a user's positions and potential profit from those positions.");
  positions = await maker.getUserTradingPositions({ account: makerAccount, universe });
  console.log('Positions:', JSON.stringify(positions, null, 2));
  profitLossSummary = await maker.getProfitLossSummary({ account: makerAccount, universe });
  console.log('Profit/Loss:', JSON.stringify(profitLossSummary, null, 2));

  // Orders data structure: market -> outcome -> direction -> [order]
  orders = await maker.getZeroXOrders({ marketId: market.id });
  console.log('All Orders for market:', JSON.stringify(orders, null, 2));
  orders = await maker.getZeroXOrders({ account: makerAccount });
  console.log('All Orders for user:', JSON.stringify(orders, null, 2));

  console.log('Make another order');
  await maker.placeTrade({
    doNotCreateOrders: false, // will make an order if it can't take enough to cover the amount and price
    direction: 0, // 0=bid, 1=ask
    outcome: 2, // 0=invalid (market will resolve as invalid), 1-7 are valid outcomes whose meaning depends on the market
    displayAmount: new BigNumber(10), // buy 10 shares
    displayPrice: new BigNumber(0.1), // 10 cents per share
    displayShares: new BigNumber(0), // user doesn't have any shares they could pay with instead of using DAI
    market: market.id,
    displayMinPrice: new BigNumber(market.minPrice),
    displayMaxPrice: new BigNumber(market.maxPrice),
    numTicks: new BigNumber(market.numTicks),
    numOutcomes: market.numOutcomes,
    tradeGroupId,
    fingerprint,
    expirationTime,
  });
}

main()
  .then(() => console.log('\nDone! Press control-c to end.'))
  .catch((e) => console.error('', e, '\nError! Press control-c to end.'));
