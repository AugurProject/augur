import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { WSClient } from '@0x/mesh-rpc-client';
import { JsonRpcProvider } from 'ethers/providers';

import { ACCOUNTS, Account, makeGSNDependencies, makeSigner } from '@augurproject/tools';
import { EthersFastSubmitWallet } from '@augurproject/core';
import { buildConfig, SDKConfiguration } from '@augurproject/artifacts';
import {
  Augur,
  Connectors,
  NULL_ADDRESS,
  SubscriptionEventName,
  ZeroX,
  MarketReportingState
} from '@augurproject/sdk';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { MarketList } from '@augurproject/sdk/build/state/getter/Markets';
import { sleep } from '@augurproject/sdk/build/state/utils/utils';
import { LogFilterAggregator } from '@augurproject/sdk/build/state/logs/LogFilterAggregator';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { BlockAndLogStreamerSyncStrategy } from '@augurproject/sdk/build/state/sync/BlockAndLogStreamerSyncStrategy';
import { Controller } from '@augurproject/sdk/build/state/Controller';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';

import { LONG, SHORT, trade } from './common';

async function makeDependencies(provider: EthersProvider, config: SDKConfiguration, account: Account, signer?: EthersFastSubmitWallet) {
  signer = signer || await makeSigner(account, provider);
  return makeGSNDependencies(
    provider,
    signer,
    config.addresses.AugurWalletRegistry,
    config.addresses.EthExchange,
    config.addresses.WETH9,
    config.addresses.Cash,
    account.address,
  );
}

function makeZeroX(config: SDKConfiguration): ZeroX {
  const zeroX = new ZeroX();
  zeroX.rpc = new WSClient(config.zeroX.rpc.ws);
  return zeroX;
}

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

async function getWallet(augur: Augur, account: Account): Promise<string> {
  const walletFromRegistry = await augur.contracts.augurWalletRegistry.getWallet_(account.address);
  if (walletFromRegistry !== NULL_ADDRESS) {
    return walletFromRegistry;
  }

  return augur.gsn.calculateWalletAddress(account.address);
}

async function makeDB(augur: Augur): Promise<DB> {
  const logFilterAggregator = LogFilterAggregator.create(
    augur.contractEvents.getEventTopics,
    augur.contractEvents.parseLogs,
  );

  return DB.createAndInitializeDB(
    Number(augur.networkId),
    logFilterAggregator,
    augur,
    !!augur.zeroX,
  );
}

class Sync {
  private bulkSyncStrategy: BulkSyncStrategy;
  private blockAndLogStreamerSyncStrategy: BlockAndLogStreamerSyncStrategy;
  private needsToBulkSync = true;

  constructor(private augur: Augur, private db: DB, private provider: EthersProvider) {
    const contractAddresses = augur.contractEvents.getAugurContractAddresses();

    new Controller(augur, Promise.resolve(db), db.logFilters);

    this.bulkSyncStrategy = new BulkSyncStrategy(
      provider.getLogs,
      contractAddresses,
      db.logFilters.onLogsAdded,
      augur.contractEvents.parseLogs,
    );

    this.blockAndLogStreamerSyncStrategy = BlockAndLogStreamerSyncStrategy.create(
      provider,
      contractAddresses,
      db.logFilters,
      augur.contractEvents.parseLogs,
    )
  }

  sync = async (highestBlockNumberToSync?: number) => {
    const { number: blockNumber } = await this.provider.getBlock(highestBlockNumberToSync || 'latest');
    if (this.needsToBulkSync) {
      const syncStartingBlock = await this.db.getSyncStartingBlock();
      await this.bulkSyncStrategy.start(
        syncStartingBlock,
        blockNumber
      );

      await this.db.sync(blockNumber);

      this.augur.events.emit(SubscriptionEventName.BulkSyncComplete, {
        eventName: SubscriptionEventName.BulkSyncComplete,
      });

      this.needsToBulkSync = false;
    } else {
      let highestSyncedBlock = (await this.db.getSyncStartingBlock());
      while (highestSyncedBlock <= blockNumber) {
        const block = await this.provider.getBlock(highestSyncedBlock);
        await this.blockAndLogStreamerSyncStrategy.onBlockAdded({
          ...block,
          number: block.number.toString(),
        });
        highestSyncedBlock++;
      }
    }
  }
}

async function makeUser(config: SDKConfiguration, provider: EthersProvider, account: Account) {
  const zeroX = makeZeroX(config);
  const dependencies = await makeDependencies(provider, config, account);
  const connector = new Connectors.DirectConnector();
  const augur = await Augur.create(provider, dependencies, config, connector, zeroX, true);
  const db = await makeDB(augur);

  const sync = new Sync(augur, db, provider);

  connector.initialize(augur, db);

  await approve(augur);
  await augur.contracts.cashFaucet.faucet(new BigNumber(100e18)); // faucet 100 DAI for trading
  const wallet = await getWallet(augur, account);
  await augur.contracts.cash.transfer(wallet, new BigNumber(100e18)); // put DAI into the wallet

  augur.setUseWallet(true); // gsn wallet
  augur.setUseRelay(true); // gsn relay

  return { augur, sync };
}

describe('robert', () => {
  test('zerion', async () => {
    // setup
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

    const john = await makeUser(config, provider, ACCOUNTS[0]);
    const mary = await makeUser(config, provider, ACCOUNTS[1]);

    // TODO make user with a connector (that is initialized) so can do user.UserTradingPositions etc
    const user = john;
    const [ maker, taker ] = [ john, mary ];
    const account = await user.augur.getAccount();
    const universe = user.augur.config.addresses.Universe;

    console.log('Fauceting some DAI for market creation');
    const marketCreationFee = await user.augur.contracts.universe.getOrCacheValidityBond_();
    await user.augur.contracts.cashFaucet.faucet(marketCreationFee);

    console.log('Fauceting some REP for market creation');
    const repBond = await user.augur.contracts.universe.getOrCacheMarketRepBond_();
    await user.augur.contracts.legacyReputationToken.faucet(repBond.plus(1e18));

    console.log(ACCOUNTS[0].address, await user.augur.provider.getBalance(ACCOUNTS[0].address));
    console.log(account, await user.augur.provider.getBalance(account));
    console.log(await user.augur.getAccount(), await user.augur.provider.getBalance(await user.augur.getAccount()));

    console.log('THE NEXT CALL FAILS');
    console.log(await user.augur.sendETH(await mary.augur.getAccount(), new BigNumber(1)));
    console.log('SUCCESS!');

    console.log('Creating market');
    const currentTimestamp = (await user.augur.getTimestamp()).toNumber();
    const designatedReporter = ACCOUNTS[0].address;
    // TODO fails here but it's probably from setup problems
    const marketContract = await user.augur.createYesNoMarket({
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
    user.sync.sync();

    console.log('Querying for markets');
    const markets: MarketList = await user.augur.getMarkets({
      universe,
      // account,
      includeWarpSyncMarkets: false,
      reportingStates: [MarketReportingState.PreReporting], // TODO is this the right state?
      // maxEndTime: now, // TODO into the future a bit? TODO need reportingStates if this is specified?
      // TODO invalid filter? max liquidity spread? probably need to be specified by zerion users
    });
    const market = markets.markets.find((m) => m.id === marketContract.address);

    console.log('MARKET', JSON.stringify(market, null, 2));

    const tradeGroupId = '42'; // not strictly necessary. value is arbitrary
    const fingerprint = formatBytes32String('11'); // for affiliate functionality. not strictly necessary. value is arbitrary
    const expirationTime = new BigNumber(new Date().valueOf()).plus(1000000); // in the future a ways
    maker.augur.placeTrade({
      doNotCreateOrders: false, // must create an order - won't take if another exists
      direction: 0, // 0=bid, 1=ask
      market: market.id,
      numTicks: new BigNumber(market.numTicks),
      numOutcomes: 3,//market.numOutcomes,
      outcome: 1, // 0=invalid (market will resolve as invalid), 1-7 are valid outcomes whose meaning depends on the market
      tradeGroupId: '42',
      fingerprint,
      displayMinPrice: new BigNumber(market.minPrice),
      displayMaxPrice: new BigNumber(market.maxPrice),
      displayAmount: new BigNumber(10), // buy 10 shares
      displayPrice: new BigNumber(0.1), // 10 cents per share or better
      displayShares: new BigNumber(0), // user doesn't have any shares they could pay with instead of using DAI
      expirationTime,
    });

    user.sync.sync();

    // await trade(user, 0, [
    //   { market: marketContract, maker, taker, direction: SHORT, outcome: 1, quantity: 20, price: 0.60 },
    //   { market: marketContract, maker, taker, direction: LONG, outcome: 2, quantity: 50, price: 0.30 },
    // ]);

    // Get a user's positions and potential profit from those positions. (Is potential profit just at the current time? Like derived from latest price.)

    const positions = await user.augur.getUserTradingPositions({ account , universe });
    console.log('POSITIONS', JSON.stringify(positions, null, 2));

    const profitLossSummary = await user.augur.getProfitLossSummary({ account, universe });
    console.log('PL', JSON.stringify(profitLossSummary, null, 2));

    // Take an existing order at market price. Does not create new orders.
    const numShares = new BigNumber(10); // 10 shares - would be 10e18 but numShares for place is "display shares" not "atto shares"


    // take specific order
    // await user.contracts.fillOrder.publicFillOrder(
    //   'id taken from 0x',
    //   numShares.times(1e18), // numShares here is in attoShares
    //   tradeGroupId,
    //   fingerprint,
    // );


    // take any orders it can, without creating any new ones
    await user.augur.placeTrade({
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

    await sleep(30 * 1000); // wait for 0x orders to propagate
    const orders = await user.augur.getZeroXOrders({ marketId: market.id });

    console.log('ORDERS', JSON.stringify(orders, null, 2));

    // Get 0x orderbook for augur. Other methods do this in the backend but perhaps the users want to see the orderbook itself?
  });
});
