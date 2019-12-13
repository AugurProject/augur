import { API } from "@augurproject/sdk/build/state/getter/API";
import {
  GetMarketsSortBy,
  MarketInfo,
  MarketList,
  MarketOrderBook
} from "@augurproject/sdk/build/state/getter/Markets";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { MarketReportingState } from "@augurproject/sdk/build/constants";
import { makeDbMock, makeProvider } from "../../../libs";
import { ACCOUNTS, ContractAPI, defaultSeedPath, fork, loadSeedFile } from "@augurproject/tools";
import { NULL_ADDRESS, stringTo32ByteHex } from "../../../libs/Utils";
import { BigNumber } from "bignumber.js";
import { ORDER_TYPES, SECONDS_IN_A_DAY } from "@augurproject/sdk";
import { getAddress } from "ethers/utils/address";

import * as _ from "lodash";
import { TestEthersProvider } from "../../../libs/TestEthersProvider";

const CHUNK_SIZE = 100000;

const outcome0 = new BigNumber(0);
const outcome1 = new BigNumber(1);
describe('State API :: Markets :: ', () => {
  let mockDB
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
  let bob: ContractAPI;

  let baseProvider: TestEthersProvider;
  const markets = {};

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    baseProvider = await makeProvider(seed, ACCOUNTS);
    const addresses = baseProvider.getContractAddresses();

    john = await ContractAPI.userWrapper(ACCOUNTS[0], baseProvider, addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], baseProvider, addresses);
    bob = await ContractAPI.userWrapper(ACCOUNTS[2], baseProvider, addresses);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
    await bob.approveCentralAuthority();

    let endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
    const highFeePerCashInAttoCash = new BigNumber(10).pow(18).div(10); // 10% creator fee
    const affiliateFeeDivisor = new BigNumber(0);
    const designatedReporter = john.account.publicKey;
    markets['yesNoMarket1'] = (await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash: lowFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo: '{"categories": ["common", "yesNo 1 secondary", "yesNo 1 tertiary"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1"}',
    })).address;
    markets['yesNoMarket2'] = (await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash: lowFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo: '{"categories": ["yesNo 2 primary", "yesNo 2 secondary", "yesNo 2 tertiary"], "description": "yesNo description 2", "longDescription": "yesNo longDescription 2"}',
    })).address;
    markets['categoricalMarket1'] = (await john.createCategoricalMarket({
      endTime,
      feePerCashInAttoCash: lowFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      outcomes: [stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')],
      extraInfo: '{"categories": ["categorical 1 primary", "categorical 1 secondary", "categorical 1 tertiary"], "description": "categorical description 1", "longDescription": "categorical longDescription 1"}',
    })).address;
    markets['categoricalMarket2'] = (await john.createCategoricalMarket({
      endTime,
      feePerCashInAttoCash: highFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      outcomes: [stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')],
      extraInfo: '{"categories": ["categorical 2 primary", "categorical 2 secondary", "categorical 2 tertiary"], "description": "categorical description 2", "longDescription": "categorical longDescription 2"}',
    })).address;
    markets['scalarMarket1'] = (await john.createScalarMarket({
      endTime,
      feePerCashInAttoCash: highFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      prices: [new BigNumber(0), new BigNumber(100)],
      numTicks: new BigNumber(100),
      extraInfo: '{"categories": ["common", "scalar 1 secondary", "scalar 1 tertiary"], "description": "scalar description 1", "longDescription": "scalar longDescription 1", "_scalarDenomination": "scalar denom 1"}',
    })).address;
    endTime = endTime.plus(1);
    markets['scalarMarket2'] = (await john.createScalarMarket({
      endTime,
      feePerCashInAttoCash: highFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      prices: [new BigNumber(0), new BigNumber(100)],
      numTicks: new BigNumber(100),
      extraInfo: '{"categories": ["scalar 2 primary", "scalar 2 secondary", "scalar 2 tertiary"], "description": "scalar description 2", "longDescription": "scalar longDescription 2", "_scalarDenomination": "scalar denom 2"}',
    })).address;

  });

  beforeEach(async () => {
    const provider = await baseProvider.fork();
    const addresses = baseProvider.getContractAddresses();
    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, addresses);
    bob = await ContractAPI.userWrapper(ACCOUNTS[2], provider, addresses);
    db = makeDbMock().makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
  });

  // NOTE: Full-text searching is also tested in MarketDerivedDB.test.ts
  test(':getMarkets general', async () => {
    const universe = john.augur.contracts.universe;

    const yesNoMarket1 = john.augur.contracts.marketFromAddress(markets['yesNoMarket1']);
    const yesNoMarket2 = john.augur.contracts.marketFromAddress(markets['yesNoMarket2']);
    const categoricalMarket1 = john.augur.contracts.marketFromAddress(markets['categoricalMarket1']);
    const categoricalMarket2 = john.augur.contracts.marketFromAddress(markets['categoricalMarket2']);
    const scalarMarket1 = john.augur.contracts.marketFromAddress(markets['scalarMarket1']);
    const scalarMarket2 = john.augur.contracts.marketFromAddress(markets['scalarMarket2']);

    const actualDB = await db;
    await actualDB.sync(john.augur, CHUNK_SIZE, 0);

    let marketList: MarketList;

    // Test invalid universe address
    let errorMessage = '';
    try {
      await api.route('getMarkets', {
        universe: NULL_ADDRESS,
      });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual(
      'Unknown universe: ' + NULL_ADDRESS
    );

    // Test creator
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      creator: ACCOUNTS[0].publicKey,
      isSortDescending: false,
    });
    expect(marketList.markets.length).toEqual(6);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      offset: 1,
      limit: 4,
    });

    expect(marketList.markets.length).toEqual(4);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      creator: NULL_ADDRESS,
    });
    expect(marketList).toEqual({
      markets: [],
      meta: {
        categories: {},
        filteredOutCount: 6,
        marketCount: 0,
      },
    });

    // Test maxEndTime
    const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      maxEndTime: endTime.toNumber(),
    });
    expect(marketList).toEqual({
      markets: [],
      meta: {
        categories: {},
        filteredOutCount: 6,
        marketCount: 0,
      },
    });

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      maxEndTime: endTime.plus(2).toNumber(),
    });
    expect(marketList.markets.length).toEqual(6);

    // Test designatedReporter
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      designatedReporter: ACCOUNTS[0].publicKey,
    });
    expect(marketList.markets.length).toEqual(6);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      designatedReporter: NULL_ADDRESS,
    });
    expect(marketList).toEqual({
      markets: [],
      meta: {
        categories: {},
        filteredOutCount: 6,
        marketCount: 0,
      },
    });

    // Test maxFee
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      maxFee: '0.05',
    });
    expect(marketList).toEqual({
      markets: [],
      meta: {
        categories: {},
        filteredOutCount: 6,
        marketCount: 0,
      },
    });

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      maxFee: '0.06',
      isSortDescending: false,
    });
    expect(marketList.markets.length).toEqual(3);
    let marketIds = _.map(marketList.markets, "id");
    expect(marketIds).toContain(categoricalMarket1.address);
    expect(marketIds).toContain(yesNoMarket1.address);
    expect(marketIds).toContain(yesNoMarket2.address);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      maxFee: '0.11',
    });
    expect(marketList.markets.length).toEqual(6);

    // Test search & categories params
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      search: 'scalar description 1',
    });
    expect(marketList.markets.length).toEqual(1);
    expect(marketList.markets[0].id).toEqual(scalarMarket1.address);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      search: 'scalar',
      categories: [
        'scalar 2 primary',
        'scalar 2 secondary',
        'scalar 2 tertiary',
      ],
    });
    expect(marketList.markets.length).toEqual(1);
    expect(marketList.markets[0].id).toEqual(scalarMarket2.address);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      search: ACCOUNTS[0].publicKey,
    });
    expect(marketList.markets.length).toEqual(6);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      categories: [
        'scalar 2',
        'scalar 2',
        'scalar 2',
      ],
    });
    expect(marketList.markets.length).toEqual(0);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      categories: [
        'scalar 2 primary',
        'scalar 2 secondary',
        'scalar 2 tertiary',
      ],
    });
    expect(marketList.markets.length).toEqual(1);
    expect(marketList.markets[0].id).toEqual(scalarMarket2.address);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      search: 'scalar description 1',
      categories: [
        'scalar 2 primary',
        'scalar 2 secondary',
        'scalar 2 tertiary',
      ],
    });
    expect(marketList).toEqual({
      markets: [],
      meta: {
        categories: {},
        filteredOutCount: 6,
        marketCount: 0,
      },
    });

    // Place orders Bidding on Invalid on some markets
    let numShares = new BigNumber(10**18);
    let price = new BigNumber(50);
    await john.placeOrder(
      yesNoMarket1.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      categoricalMarket1.address,
      ORDER_TYPES.BID,
      numShares.multipliedBy(2), // To bypass the minimum cost filter we need to trade more for categoricals
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      scalarMarket1.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    // Test includeInvalidMarkets & filteredOutCount
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      includeInvalidMarkets: false,
    });

    expect(marketList.markets.length).toEqual(3);
    marketIds = _.map(marketList.markets, 'id');
    expect(marketIds).toContain(yesNoMarket2.address);
    expect(marketIds).toContain(categoricalMarket2.address);
    expect(marketIds).toContain(scalarMarket2.address);
    expect(marketList.meta.filteredOutCount).toEqual(3);

    // Partially fill orders
    const cost = numShares.multipliedBy(50).div(2);
    const yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket1.address,
      outcome0
    );
    const categoricalOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      categoricalMarket1.address,
      outcome0
    );
    const scalarOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      scalarMarket1.address,
      outcome0
    );
    await john.fillOrder(yesNoOrderId1, numShares.div(2), '42', cost);
    await mary.fillOrder(categoricalOrderId1, numShares, '43', cost.multipliedBy(2));
    await mary.fillOrder(scalarOrderId1, numShares.div(2), '43', cost);

    // Completely fill orders
    await john.setTimestamp(endTime.minus(15));
    await john.fillOrder(yesNoOrderId1, numShares.div(2), '42', cost);
    await john.setTimestamp(endTime.minus(10));
    await mary.fillOrder(categoricalOrderId1, numShares, '43', cost.multipliedBy(2));
    await john.setTimestamp(endTime.minus(5));
    await mary.fillOrder(scalarOrderId1, numShares.div(2), '43', cost);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      includeInvalidMarkets: false,
    });

    expect(marketList.markets.length).toEqual(6);

    // Create some liquidity
    numShares = new BigNumber(10**18).multipliedBy(10);
    await john.placeOrder(
      yesNoMarket1.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket1.address,
      ORDER_TYPES.ASK,
      numShares,
      price.plus(14),
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      categoricalMarket1.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      categoricalMarket1.address,
      ORDER_TYPES.ASK,
      numShares,
      price.plus(19),
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    // Test maxLiquiditySpread & filteredOutCount
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      maxLiquiditySpread: '20',
    });

    expect(marketList.markets.length).toEqual(2);
    marketIds = _.map(marketList.markets, 'id');
    expect(marketIds).toContain(categoricalMarket1.address);
    expect(marketIds).toContain(yesNoMarket1.address);
    expect(marketList.meta.filteredOutCount).toEqual(4);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      maxLiquiditySpread: '15',
    });

    expect(marketList.markets.length).toEqual(1);
    marketIds = _.map(marketList.markets, 'id');
    expect(marketIds).toContain(yesNoMarket1.address);
    expect(marketList.meta.filteredOutCount).toEqual(5);

    // Move timestamp to designated reporting phase
    await john.setTimestamp(endTime.plus(1));

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    // Test reportingStates
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      reportingStates: [MarketReportingState.DesignatedReporting],
      isSortDescending: false,
    });
    expect(marketList.markets.length).toEqual(6);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      reportingStates: [MarketReportingState.PreReporting],
    });
    expect(marketList.markets).toEqual([]);

    await john.setTimestamp(endTime.plus(2));

    const noPayoutSet = [
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
    ];
    await john.doInitialReport(yesNoMarket1, noPayoutSet);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    // Test sortBy
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      sortBy: GetMarketsSortBy.endTime,
    });
    expect(marketList.markets.length).toEqual(6);
    expect(marketList.markets[0].id).toEqual(scalarMarket2.address);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      sortBy: GetMarketsSortBy.endTime,
      isSortDescending: false,
    });
    expect(marketList.markets.length).toEqual(6);
    expect(marketList.markets[5].id).toEqual(scalarMarket2.address);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      sortBy: GetMarketsSortBy.marketOI,
    });
    expect(marketList.markets.length).toEqual(6);
    expect(marketList.markets[0].id).toEqual(categoricalMarket1.address);
    expect(marketList.markets[1].id).toEqual(scalarMarket1.address);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      sortBy: GetMarketsSortBy.volume,
    });
    expect(marketList.markets.length).toEqual(6);
    expect(marketList.markets[0].id).toEqual(categoricalMarket1.address);
    expect([scalarMarket1.address, yesNoMarket1.address]).toContain(marketList.markets[1].id);
    expect([scalarMarket1.address, yesNoMarket1.address]).toContain(marketList.markets[2].id);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      sortBy: GetMarketsSortBy.disputeRound,
    });
    expect(marketList.markets.length).toEqual(6);
    expect(marketList.markets[0].id).toEqual(yesNoMarket1.address);

    marketList = await api.route('getMarkets', {
      universe: universe.address,
      sortBy: GetMarketsSortBy.totalRepStakedInMarket,
    });
    expect(marketList.markets.length).toEqual(6);
    expect(marketList.markets[0].id).toEqual(yesNoMarket1.address);

    // @TODO: Add tests for filtering markets maxLiquiditySpread = '0'
  });

  test(':getMarkets userPortfolioAddress', async () => {
    const universe = john.augur.contracts.universe;
    const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
    const affiliateFeeDivisor = new BigNumber(0);
    const designatedReporter = john.account.publicKey;
    const yesNoMarket1 = await bob.createYesNoMarket({
      endTime,
      feePerCashInAttoCash: lowFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo: '{"categories": ["yesNo 1 primary", "yesNo 1 secondary", "yesNo 1 tertiary"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1"}',
    });

    const yesNoMarket2 = john.augur.contracts.marketFromAddress(markets['yesNoMarket2']);
    const categoricalMarket1 = john.augur.contracts.marketFromAddress(markets['categoricalMarket1']);
    const categoricalMarket2 = john.augur.contracts.marketFromAddress(markets['categoricalMarket2']);

    // Report on a market with Bob
    await john.setTimestamp(endTime.plus(24 * 60 * 60 * 2));

    let payoutSet = [
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
    ];
    await bob.doInitialReport(yesNoMarket2, payoutSet);

    payoutSet = [
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
      new BigNumber(0),
    ];
    // Report on a market with John then dispute that market with Bob
    await john.doInitialReport(categoricalMarket1, payoutSet);

    payoutSet = [
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
    ];
    await bob.repFaucet(new BigNumber(1));
    await bob.contribute(categoricalMarket1, payoutSet, new BigNumber(1));

    // Trade on a market with Bob
    const bid = new BigNumber(0);
    const outcome = new BigNumber(0);
    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);
    await bob.placeOrder(
      categoricalMarket2.address,
      bid,
      numShares,
      price,
      outcome,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    const actualDB = await db;
    await actualDB.sync(john.augur, CHUNK_SIZE, 0);

    let marketList: MarketList;

    // Test user portfolio filter
    marketList = await api.route('getMarkets', {
      universe: universe.address,
      userPortfolioAddress: getAddress(ACCOUNTS[2].publicKey),
    });
    expect(marketList.markets.length).toEqual(4);
    let marketIds = _.map(marketList.markets, "id")
    expect(marketIds).toContain(categoricalMarket1.address);
    expect(marketIds).toContain(categoricalMarket2.address);
    expect(marketIds).toContain(yesNoMarket1.address);
    expect(marketIds).toContain(yesNoMarket2.address);
  });

  test(':getMarketPriceHistory', async () => {
    const yesNoMarket = await john.createReasonableYesNoMarket();
    const categoricalMarket = await john.createReasonableMarket(
      [stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')]
    );

    // Place orders

    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      categoricalMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      categoricalMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    // Fill orders
    await john.faucet(new BigNumber(1e18)); // faucet enough cash for the various fill orders
    await mary.faucet(new BigNumber(1e18)); // faucet enough cash for the various fill orders
    let yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    let yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    let categoricalOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      categoricalMarket.address,
      outcome0
    );
    let categoricalOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      categoricalMarket.address,
      outcome1
    );
    await john.fillOrder(
      yesNoOrderId0,
      numShares.div(10).multipliedBy(2),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      numShares.div(10).multipliedBy(3),
      '43'
    );
    await mary.fillOrder(
      categoricalOrderId0,
      numShares.div(10).multipliedBy(2),
      '43'
    );
    await mary.fillOrder(
      categoricalOrderId1,
      numShares.div(10).multipliedBy(4),
      '43'
    );

    const newTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    await john.setTimestamp(newTime);

    yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    categoricalOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      categoricalMarket.address,
      outcome0
    );
    categoricalOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      categoricalMarket.address,
      outcome1
    );
    await john.fillOrder(
      yesNoOrderId0,
      numShares.div(10).multipliedBy(4),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      numShares.div(10).multipliedBy(5),
      '43'
    );
    await mary.fillOrder(
      categoricalOrderId0,
      numShares.div(10).multipliedBy(4),
      '43'
    );
    await mary.fillOrder(
      categoricalOrderId1,
      numShares.div(10).multipliedBy(2),
      '43'
    );

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    const yesNoMarketPriceHistory = await api.route('getMarketPriceHistory', {
      marketId: yesNoMarket.address,
    });
    expect(yesNoMarketPriceHistory).toMatchObject({
      '0': [
        { amount: '8000000000000', price: '22' },
        { amount: '4000000000000', price: '22' },
      ],
      '1': [
        { amount: '7000000000000', price: '22' },
        { amount: '2000000000000', price: '22' },
      ],
    });
    for (let outcome = 0; outcome < yesNoMarketPriceHistory.length; outcome++) {
      for (
        let fillOrder = 0;
        fillOrder < yesNoMarketPriceHistory[outcome].length;
        fillOrder++
      ) {
        expect(yesNoMarketPriceHistory[outcome][fillOrder]).toHaveProperty(
          'timestamp'
        );
        if (fillOrder > 0) {
          expect(
            yesNoMarketPriceHistory[outcome][fillOrder].timestamp
          ).toBeGreaterThan(
            yesNoMarketPriceHistory[outcome][fillOrder].timestamp
          );
        }
      }
    }

    const categoricalMarketPriceHistory = await api.route(
      'getMarketPriceHistory',
      {
        marketId: categoricalMarket.address,
      }
    );
    expect(categoricalMarketPriceHistory).toMatchObject({
      '0': [
        { amount: '8000000000000', price: '22' },
        { amount: '4000000000000', price: '22' },
      ],
      '1': [
        { amount: '6000000000000', price: '22' },
        { amount: '4000000000000', price: '22' },
      ],
    });
    for (
      let outcome = 0;
      outcome < categoricalMarketPriceHistory.length;
      outcome++
    ) {
      for (
        let fillOrder = 0;
        fillOrder < categoricalMarketPriceHistory[outcome].length;
        fillOrder++
      ) {
        expect(
          categoricalMarketPriceHistory[outcome][fillOrder]
        ).toHaveProperty('timestamp'
      );
        if (fillOrder > 0) {
          expect(
            categoricalMarketPriceHistory[outcome][fillOrder].timestamp
          ).toBeGreaterThan(
            categoricalMarketPriceHistory[outcome][fillOrder].timestamp
          );
        }
      }
    }
  });

  test(':getMarketPriceCandlesticks', async () => {
    const yesNoMarket = await john.createReasonableYesNoMarket();

    const startTime = (await john.getTimestamp()).toNumber();

    // Place orders

    const numShares = new BigNumber(10000000000000);
    const price0 = new BigNumber(10);
    const price1 = new BigNumber(20);
    const price2 = new BigNumber(30);
    const price3 = new BigNumber(40);
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price0,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price1,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price2,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price3,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price0,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price1,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price2,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price3,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    // Fill orders
    mary.faucet(new BigNumber(1e18)); // faucet enough

    const cost0 = numShares
      .multipliedBy(new BigNumber(100).minus(price0))
      .div(10);
    const cost1 = numShares
      .multipliedBy(new BigNumber(100).minus(price1))
      .div(10);
    const cost2 = numShares
      .multipliedBy(new BigNumber(100).minus(price2))
      .div(10);
    const cost3 = numShares
      .multipliedBy(new BigNumber(100).minus(price3))
      .div(10);
    let yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    let yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    await mary.fillOrder(
      yesNoOrderId0,
      numShares.div(10).multipliedBy(5),
      '42',
      cost0
    );
    await mary.fillOrder(
      yesNoOrderId1,
      numShares.div(10).multipliedBy(7),
      '43',
      cost1
    );

    // Move time forward 10 minutes
    let newTime = (await john.getTimestamp()).plus(60 * 10);
    await john.setTimestamp(newTime);

    yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    await mary.fillOrder(
      yesNoOrderId0,
      numShares.div(10).multipliedBy(4),
      '42',
      cost1
    );
    await mary.fillOrder(
      yesNoOrderId1,
      numShares.div(10).multipliedBy(4),
      '43',
      cost0
    );

    // Move time forward 30 minutes
    newTime = (await john.getTimestamp()).plus(60 * 30);
    await john.setTimestamp(newTime);

    yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    await mary.fillOrder(
      yesNoOrderId0,
      numShares.div(10).multipliedBy(6),
      '42',
      cost0
    );
    await mary.fillOrder(
      yesNoOrderId1,
      numShares.div(10).multipliedBy(8),
      '43',
      cost1
    );

    yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    await mary.fillOrder(
      yesNoOrderId0,
      numShares.div(10).multipliedBy(7),
      '42',
      cost1
    );
    await mary.fillOrder(
      yesNoOrderId1,
      numShares.div(10).multipliedBy(9),
      '43',
      cost1
    );

    // Move time forward 30 minutes
    newTime = (await john.getTimestamp()).plus(60 * 30);
    await john.setTimestamp(newTime);

    yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    await mary.fillOrder(
      yesNoOrderId0,
      numShares.div(10).multipliedBy(6),
      '42',
      cost2
    );
    await mary.fillOrder(
      yesNoOrderId1,
      numShares.div(10).multipliedBy(5),
      '43',
      cost1
    );

    yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    await mary.fillOrder(
      yesNoOrderId0,
      numShares.div(10).multipliedBy(7),
      '42',
      cost0
    );
    await mary.fillOrder(
      yesNoOrderId1,
      numShares.div(10).multipliedBy(3),
      '43',
      cost3
    );

    // Move time forward 60 minutes
    newTime = (await john.getTimestamp()).plus(60 * 60);
    await john.setTimestamp(newTime);

    const endTime = (await john.getTimestamp()).toNumber();

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    let yesNoMarketPriceCandlesticks = await api.route(
      'getMarketPriceCandlesticks',
      {
        marketId: yesNoMarket.address,
      }
    );
    expect(yesNoMarketPriceCandlesticks).toMatchObject({
      '0': [
        {
        tokenVolume: '0.0005',
        start: '0.4',
        end: '0.4',
        min: '0.4',
        max: '0.4',
        volume: '0.0003',
          shareVolume: '0.0005',
      },
      {
        tokenVolume: '0.0004',
        start: '0.4',
        end: '0.4',
        min: '0.4',
        max: '0.4',
        volume: '0.00024',
          shareVolume: '0.0004',
      },
      {
        tokenVolume: '0.0008',
        start: '0.4',
        end: '0.4',
        min: '0.3',
        max: '0.4',
        volume: '0.00055',
          shareVolume: '0.0008',
      },
      {
        tokenVolume: '0.001',
        start: '0.3',
        end: '0.3',
        min: '0.2',
        max: '0.3',
        volume: '0.00077',
          shareVolume: '0.001',
        },
      ],
      '1': [
        {
        tokenVolume: '0.0007',
        start: '0.4',
        end: '0.4',
        min: '0.4',
        max: '0.4',
        volume: '0.00042',
          shareVolume: '0.0007',
      },
      {
        tokenVolume: '0.0003',
        start: '0.4',
        end: '0.4',
        min: '0.4',
        max: '0.4',
        volume: '0.00018',
          shareVolume: '0.0003',
      },
      {
        tokenVolume: '0.001',
        start: '0.3',
        end: '0.3',
        min: '0.3',
        max: '0.3',
        volume: '0.0007',
          shareVolume: '0.001',
      },
      {
        tokenVolume: '0.0008',
        start: '0.2',
        end: '0.2',
        min: '0.2',
        max: '0.2',
        volume: '0.00064',
          shareVolume: '0.0008',
        },
      ],
    });
    for (const outcome in yesNoMarketPriceCandlesticks) {
      for (
        let candlestickIndex = 0;
        candlestickIndex < yesNoMarketPriceCandlesticks[outcome];
        candlestickIndex++
      ) {
        expect(
          yesNoMarketPriceCandlesticks[outcome][candlestickIndex][
            'startTimestamp'
          ]
        ).toBeInstanceOf(Number);
      }
    }

    yesNoMarketPriceCandlesticks = await api.route(
      'getMarketPriceCandlesticks',
      {
        marketId: yesNoMarket.address,
        start: startTime + 30,
        end: endTime - 30,
        outcome: 1,
        period: 30,
      }
    );
    expect(yesNoMarketPriceCandlesticks).toMatchObject({
      '1': [
        {
        tokenVolume: '0.0003',
        start: '0.4',
        end: '0.4',
        min: '0.4',
        max: '0.4',
        volume: '0.00018',
          shareVolume: '0.0003',
      },
      {
        tokenVolume: '0.001',
        start: '0.3',
        end: '0.3',
        min: '0.3',
        max: '0.3',
        volume: '0.0007',
          shareVolume: '0.001',
      },
      {
        tokenVolume: '0.0008',
        start: '0.2',
        end: '0.2',
        min: '0.2',
        max: '0.2',
        volume: '0.00064',
          shareVolume: '0.0008',
        },
      ],
    });
    for (const outcome in yesNoMarketPriceCandlesticks) {
      for (
        let candlestickIndex = 0;
        candlestickIndex < yesNoMarketPriceCandlesticks[outcome];
        candlestickIndex++
      ) {
        expect(
          yesNoMarketPriceCandlesticks[outcome][candlestickIndex][
            'startTimestamp'
          ]
        ).toBeInstanceOf(Number);
      }
    }
  });

  describe(':getMarketOrderBook', () => {
    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);

    let blockProvider: TestEthersProvider;

    beforeAll(async () => {
      blockProvider = await baseProvider.fork();
      const addresses = blockProvider.getContractAddresses();
      john = await ContractAPI.userWrapper(ACCOUNTS[0], blockProvider, addresses);
      mary = await ContractAPI.userWrapper(ACCOUNTS[1], blockProvider, addresses);
      bob = await ContractAPI.userWrapper(ACCOUNTS[2], blockProvider, addresses);
      db = makeDbMock().makeDB(john.augur, ACCOUNTS);

      const yesNoMarket = await john.createReasonableYesNoMarket();
      markets['yesNoMarket'] = yesNoMarket.address;

      // Place Dummy orders to be filtered out.
      const scalarMarket = await john.createReasonableScalarMarket();

      await john.placeOrder(
        scalarMarket.address,
        ORDER_TYPES.BID,
        numShares,
        price,
        outcome0,
        stringTo32ByteHex(''),
        stringTo32ByteHex(''),
        stringTo32ByteHex('42')
      );
      await john.placeOrder(
        scalarMarket.address,
        ORDER_TYPES.ASK,
        numShares,
        price,
        outcome1,
        stringTo32ByteHex(''),
        stringTo32ByteHex(''),
        stringTo32ByteHex('42')
      );

      const priceAdjustment = new BigNumber(1);
      const createOrder = (orderType: BigNumber) => (
        price: BigNumber,
        outcome: BigNumber
      ) =>
        john.placeOrder(
          yesNoMarket.address,
          orderType,
          numShares,
          price,
          outcome,
          stringTo32ByteHex(''),
          stringTo32ByteHex(''),
          stringTo32ByteHex('42')
        );

      const createAsks = createOrder(ORDER_TYPES.ASK);
      const createBids = createOrder(ORDER_TYPES.BID);

      await Promise.all([
        // Outcome 0
        // Price level 1
        createAsks(price, outcome0),
        createAsks(price, outcome0),
        createAsks(price, outcome0),

        createBids(price, outcome0),
        createBids(price, outcome0),
        createBids(price, outcome0),

        // Price level 2
        createAsks(price.plus(priceAdjustment), outcome0),
        createAsks(price.plus(priceAdjustment), outcome0),

        createBids(price.minus(priceAdjustment), outcome0),
        createBids(price.minus(priceAdjustment), outcome0),

        // Outcome 1
        // Price level 1
        createAsks(price, outcome1),
        createAsks(price, outcome1),
        createAsks(price, outcome1),

        createBids(price, outcome1),
        createBids(price, outcome1),
        createBids(price, outcome1),

        // Price level 2
        createAsks(price.plus(priceAdjustment), outcome1),
        createAsks(price.plus(priceAdjustment), outcome1),

        createBids(price.minus(priceAdjustment), outcome1),
        createBids(price.minus(priceAdjustment), outcome1),
      ]);

      await (await db).sync(john.augur, CHUNK_SIZE, 0);
    });

    beforeEach(async () => {
      const provider = await blockProvider.fork();
      const addresses = blockProvider.getContractAddresses();
      john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses);
      mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, addresses);
      bob = await ContractAPI.userWrapper(ACCOUNTS[2], provider, addresses);
      db = makeDbMock().makeDB(john.augur, ACCOUNTS);
      api = new API(john.augur, db);
    });

    test('should require marketId', async () => {
      await expect(api.route('getMarketOrderBook', {})).rejects.toThrowError();
    });

    describe('outcomeId', () => {
      test('can be a single value', async () => {
        const yesNoMarket = john.augur.contracts.marketFromAddress(markets['yesNoMarket']);

        await (await db).sync(john.augur, CHUNK_SIZE, 0);
        const orderBook = (await api.route('getMarketOrderBook', {
          marketId: yesNoMarket.address,
          outcomeId: outcome0.toNumber(),
        })) as MarketOrderBook;

        expect(orderBook.orderBook).toEqual(
          expect.objectContaining({
            0: expect.objectContaining({}),
          })
        );
      });

      test('can be an array', async () => {
        const yesNoMarket = john.augur.contracts.marketFromAddress(markets['yesNoMarket']);
        await (await db).sync(john.augur, CHUNK_SIZE, 0);
        const orderBook = (await api.route('getMarketOrderBook', {
          marketId: yesNoMarket.address,
          outcomeId: [outcome0.toNumber(), outcome1.toNumber()],
        })) as MarketOrderBook;

        expect(orderBook.orderBook).toEqual(
          expect.objectContaining({
            0: expect.objectContaining({}),
            1: expect.objectContaining({}),
          })
        );
      });

      test('can be omitted', async () => {
        const yesNoMarket = john.augur.contracts.marketFromAddress(markets['yesNoMarket']);
        await (await db).sync(john.augur, CHUNK_SIZE, 0);
        const orderBook = (await api.route('getMarketOrderBook', {
          marketId: yesNoMarket.address,
          outcomeId: [outcome0.toNumber(), outcome1.toNumber()],
        })) as MarketOrderBook;

        expect(orderBook.orderBook).toEqual(
          expect.objectContaining({
            0: expect.objectContaining({}),
            1: expect.objectContaining({}),
          })
        );
      });
    });

    test('should return a complete orderbook for john', async () => {
      const yesNoMarket = john.augur.contracts.marketFromAddress(
        markets['yesNoMarket']);
      await (await db).sync(john.augur, CHUNK_SIZE, 0);
      const orderBook = (await api.route('getMarketOrderBook', {
        marketId: yesNoMarket.address,
        account: john.account.publicKey,
      })) as MarketOrderBook;

      expect(orderBook).toEqual({
        marketId: yesNoMarket.address,
        orderBook: {
          [outcome0.toString()]: {
            spread: '0',
            asks: [
              {
                price: '0.22',
                shares: '0.003',
                cumulativeShares: '0.003',
                mySize: '0.003',
              },
              {
                price: '0.23',
                shares: '0.002',
                cumulativeShares: '0.005',
                mySize: '0.002',
              },
            ],
            bids: [
              {
                price: '0.22',
                shares: '0.003',
                cumulativeShares: '0.003',
                mySize: '0.003',
              },
              {
                price: '0.21',
                shares: '0.002',
                cumulativeShares: '0.005',
                mySize: '0.002',
              },
            ],
          },
          [outcome1.toString()]: {
            spread: '0',
            asks: [
              {
                price: '0.22',
                shares: '0.003',
                cumulativeShares: '0.003',
                mySize: '0.003',
              },
              {
                price: '0.23',
                shares: '0.002',
                cumulativeShares: '0.005',
                mySize: '0.002',
              },
            ],
            bids: [
              {
                price: '0.22',
                shares: '0.003',
                cumulativeShares: '0.003',
                mySize: '0.003',
              },
              {
                price: '0.21',
                shares: '0.002',
                cumulativeShares: '0.005',
                mySize: '0.002',
              },
            ],
          },
        },
      });
    });

    test('should return mysize of zero for mary', async () => {
      const yesNoMarket = john.augur.contracts.marketFromAddress(markets['yesNoMarket']);
      await (await db).sync(john.augur, CHUNK_SIZE, 0);
      const maryApi = new API(mary.augur, db);
      const orderBook = (await maryApi.route('getMarketOrderBook', {
        marketId: yesNoMarket.address,
      })) as MarketOrderBook;

      expect(orderBook).toMatchObject({
        marketId: yesNoMarket.address,
        orderBook: {
          [outcome0.toString()]: {
            spread: '0',
            asks: [
              {
                mySize: '0',
              },
              {
                mySize: '0',
              },
            ],
            bids: [
              {
                mySize: '0',
              },
              {
                mySize: '0',
              },
            ],
          },
          [outcome1.toString()]: {
            spread: '0',
            asks: [
              {
                mySize: '0',
              },
              {
                mySize: '0',
              },
            ],
            bids: [
              {
                mySize: '0',
              },
              {
                mySize: '0',
              },
            ],
          },
        },
      });
    });
  });

  test(':getMarketsInfo general', async () => {
    const yesNoMarket = await john.createReasonableYesNoMarket();
    const categoricalMarket = await john.createReasonableMarket(
      [stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')]
    );
    const scalarMarket = await john.createReasonableScalarMarket();

    // Place orders

    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      yesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      categoricalMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      categoricalMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      scalarMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      scalarMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    // Partially fill orders
    await mary.faucet(new BigNumber(1e18));
    const yesNoOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome0
    );
    const yesNoOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      yesNoMarket.address,
      outcome1
    );
    const categoricalOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      categoricalMarket.address,
      outcome0
    );
    const categoricalOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      categoricalMarket.address,
      outcome1
    );
    const scalarOrderId0 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      scalarMarket.address,
      outcome0
    );
    const scalarOrderId1 = await john.getBestOrderId(
      ORDER_TYPES.BID,
      scalarMarket.address,
      outcome1
    );
    await mary.fillOrder(yesNoOrderId0, numShares.div(2), '42');
    await mary.fillOrder(yesNoOrderId1, numShares.div(2), '43');
    await mary.fillOrder(categoricalOrderId0, numShares.div(2), '43');
    await mary.fillOrder(categoricalOrderId1, numShares.div(2), '43');
    await mary.fillOrder(scalarOrderId0, numShares.div(2), '43');
    await mary.fillOrder(scalarOrderId1, numShares.div(2), '43');

    // Purchase complete sets
    await mary.buyCompleteSets(yesNoMarket, numShares);
    await mary.buyCompleteSets(categoricalMarket, numShares);
    await mary.buyCompleteSets(scalarMarket, numShares);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    let markets: MarketInfo[] = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketReportingState.PreReporting
    );
    expect(markets[1].reportingState).toBe(
      MarketReportingState.PreReporting
    );
    expect(markets[2].reportingState).toBe(
      MarketReportingState.PreReporting
    );

    // Skip to yes/no market end time
    let newTime = (await yesNoMarket.getEndTime_()).plus(1);
    await john.setTimestamp(newTime);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketReportingState.DesignatedReporting
    );
    expect(markets[1].reportingState).toBe(
      MarketReportingState.DesignatedReporting
    );
    expect(markets[2].reportingState).toBe(
      MarketReportingState.DesignatedReporting
    );

    const expectedRepBond = await john.getRepBond();
    expect(markets[0].noShowBondAmount).toEqual(expectedRepBond.toFixed());

    // Skip to open reporting
    newTime = newTime.plus(SECONDS_IN_A_DAY.times(7));
    await john.setTimestamp(newTime);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketReportingState.OpenReporting
    );
    expect(markets[1].reportingState).toBe(
      MarketReportingState.OpenReporting
    );
    expect(markets[2].reportingState).toBe(
      MarketReportingState.OpenReporting
    );

    // Submit intial reports
    const categoricalMarketPayoutSet = [
      new BigNumber(100),
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(0),
    ];
    await john.doInitialReport(categoricalMarket, categoricalMarketPayoutSet);

    const noPayoutSet = [
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
    ];
    const yesPayoutSet = [
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(100),
    ];
    await john.doInitialReport(yesNoMarket, noPayoutSet);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    const reportingStates = _.map(markets, 'reportingState');
    expect(reportingStates).toContain(MarketReportingState.CrowdsourcingDispute);
    expect(reportingStates).toContain(MarketReportingState.OpenReporting);

    const universe = api.augur.contracts.universeFromAddress(await yesNoMarket.getUniverse_());
    const threshold = await universe.getDisputeThresholdForDisputePacing_();

    // Dispute 11 times (its this high because of abnormal REP levels)
    mary.repFaucet(new BigNumber(10**18).multipliedBy(1000000));
    john.repFaucet(new BigNumber(10**18).multipliedBy(1000000));
    for (let disputeRound = 1; disputeRound <= 12; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        const market = await mary.getMarketContract(yesNoMarket.address);
        await mary.contribute(market, yesPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket,
          yesPayoutSet
        );
        if (remainingToFill.gte(0)) await mary.contribute(market, yesPayoutSet, remainingToFill);
      } else {
        await john.contribute(yesNoMarket, noPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket,
          noPayoutSet
        );
        if (remainingToFill.gte(0)) await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);
      }
    }

    await (await db).sync(john.augur, CHUNK_SIZE, 0);
    expect((await api.route('getMarketsInfo', { marketIds: [ yesNoMarket.address ]}))[0].reportingState)
      .toEqual(MarketReportingState.AwaitingNextWindow);
    expect((await api.route('getMarketsInfo', { marketIds: [ categoricalMarket.address ]}))[0].reportingState)
      .toEqual(MarketReportingState.CrowdsourcingDispute);
    expect((await api.route('getMarketsInfo', { marketIds: [ scalarMarket.address ]}))[0].reportingState)
      .toEqual(MarketReportingState.OpenReporting);

    const SECONDS_IN_AN_HOUR = SECONDS_IN_A_DAY.div(24);
    newTime = newTime.plus(SECONDS_IN_A_DAY.times(7)).plus(SECONDS_IN_AN_HOUR).plus(1);
    await john.setTimestamp(newTime);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);
    expect((await api.route('getMarketsInfo', { marketIds: [ yesNoMarket.address ]}))[0].reportingState)
      .toEqual(MarketReportingState.CrowdsourcingDispute);
    expect((await api.route('getMarketsInfo', { marketIds: [ categoricalMarket.address ]}))[0].reportingState)
      .toEqual(MarketReportingState.AwaitingFinalization);
    expect((await api.route('getMarketsInfo', { marketIds: [ scalarMarket.address ]}))[0].reportingState)
      .toEqual(MarketReportingState.OpenReporting);

    // Continue disputing
    for (let disputeRound = 13; disputeRound <= 19; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        const market = await mary.getMarketContract(yesNoMarket.address);
        await mary.contribute(market, yesPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket,
          yesPayoutSet
        );
        if (remainingToFill.gte(0)) await mary.contribute(market, yesPayoutSet, remainingToFill);
      } else {
        await john.contribute(yesNoMarket, noPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket,
          noPayoutSet
        );
        if (remainingToFill.gte(0)) await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);
      }
      newTime = newTime.plus(SECONDS_IN_A_DAY.times(7))
      ;
      await john.setTimestamp(newTime);
    }

    await john.finalizeMarket(categoricalMarket);

    // Fork market
    await john.contribute(yesNoMarket, noPayoutSet, new BigNumber(25000));
    const remainingToFill = await john.getRemainingToFill(
      yesNoMarket,
      noPayoutSet
    );
    if (remainingToFill.gte(0)) await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    // TODO check finalized reporting state

    expect(markets[0]).toHaveProperty('creationBlock');
    expect(markets[1]).toHaveProperty('creationBlock');
    expect(markets[2]).toHaveProperty('creationBlock');

    expect(markets[0]).toHaveProperty('creationTime');
    expect(markets[1]).toHaveProperty('creationTime');
    expect(markets[2]).toHaveProperty('creationTime');

    expect(markets[0]).toHaveProperty('endTime');
    expect(markets[1]).toHaveProperty('endTime');
    expect(markets[2]).toHaveProperty('endTime');

    expect(markets[0]).toHaveProperty('finalizationTime');
    expect(markets[1]).toHaveProperty('finalizationTime');
    expect(markets[2]).toHaveProperty('finalizationTime');

    expect(markets[0]).toHaveProperty('id');
    expect(markets[1]).toHaveProperty('id');
    expect(markets[2]).toHaveProperty('id');
  });

  test(':getMarketsInfo disputeinfo.stakes outcome valid/invalid', async () => {
    const market = await john.createReasonableYesNoMarket();
    const otherMarket = await john.createReasonableYesNoMarket();

    await (await db).sync(john.augur, CHUNK_SIZE, 0);
    let infos = await api.route('getMarketsInfo', {
      marketIds: [market.address],
    });
    expect(infos.length).toEqual(1);
    let info = infos[0];

    await fork(john, info);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);
    infos = await api.route('getMarketsInfo', {
      marketIds: [market.address],
    });
    expect(infos.length).toEqual(1);
    info = infos[0];

    expect(info).toHaveProperty('disputeInfo');
    expect(info.disputeInfo).toHaveProperty('stakes');
    expect(info.disputeInfo.stakes).toMatchObject([
      {
        outcome: '1',
        isInvalidOutcome: false,
        isMalformedOutcome: false,
      },
      {
        outcome: '0', // this test was written to verify this specific value
        isInvalidOutcome: true,
        isMalformedOutcome: false,
      },
    ]);
  });

  test(':getMarketsInfo disavowed in fork', async () => {
    const market = await john.createReasonableYesNoMarket();
    const otherMarket = await john.createReasonableYesNoMarket();

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    let infos = await api.route('getMarketsInfo', {marketIds: [market.address]});
    let info = infos[0];

    await fork(john, info);

    await otherMarket.disavowCrowdsourcers();

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    infos = await api.route('getMarketsInfo', {marketIds: [otherMarket.address]});
    expect(infos.length).toEqual(1);
    info = infos[0];

    expect(info).toHaveProperty('disavowed');
    expect(info['disavowed']).toEqual(1);
  });

  test(':getCategories : all reporting states', async () => {
    await (await db).sync(john.augur, CHUNK_SIZE, 0);
    const categories = await api.route('getCategories', {
      universe: john.augur.contracts.universe.address,
    });
    expect(categories.sort()).toEqual([
      'common',
      'yesno 1 secondary',
      'yesno 1 tertiary',
      'yesno 2 primary',
      'yesno 2 secondary',
      'yesno 2 tertiary',
      'categorical 1 primary',
      'categorical 1 secondary',
      'categorical 1 tertiary',
      'categorical 2 primary',
      'categorical 2 secondary',
      'categorical 2 tertiary',
      'scalar 1 secondary',
      'scalar 1 tertiary',
      'scalar 2 primary',
      'scalar 2 secondary',
      'scalar 2 tertiary',
    ].sort());
  });

  test(':getCategories : some reporting states', async () => {
    await (await db).sync(john.augur, CHUNK_SIZE, 0);
    const categories = await api.route('getCategories', {
      universe: john.augur.contracts.universe.address,
      reportingStates: [
        MarketReportingState.OpenReporting,
        MarketReportingState.PreReporting,
      ],
    });
    expect(categories.sort()).toMatchObject([
      'common',
      'yesno 1 secondary',
      'yesno 1 tertiary',
      'yesno 2 primary',
      'yesno 2 secondary',
      'yesno 2 tertiary',
      'categorical 1 primary',
      'categorical 1 secondary',
      'categorical 1 tertiary',
      'categorical 2 primary',
      'categorical 2 secondary',
      'categorical 2 tertiary',
      'scalar 1 secondary',
      'scalar 1 tertiary',
      'scalar 2 primary',
      'scalar 2 secondary',
      'scalar 2 tertiary',
    ].sort());
  });

  test(':getCategories : forking reporting state when no market has ever forked', async () => {
    await (await db).sync(john.augur, CHUNK_SIZE, 0);
    const categories = await api.route('getCategories', {
      universe: john.augur.contracts.universe.address,
      reportingStates: [
        MarketReportingState.Forking,
      ],
    });
    expect(categories).toMatchObject([]);
  });

  test(':getCategoryStats', async () => {
    const yesNoMarket1 = john.augur.contracts.marketFromAddress(markets['yesNoMarket1']);
    const scalarMarket1 = john.augur.contracts.marketFromAddress(markets['scalarMarket1']);

    const numShares = new BigNumber(1e21);
    const price = new BigNumber(22);

    await john.faucet(new BigNumber(1e25)); // faucet enough cash for orders
    await mary.faucet(new BigNumber(1e25)); // faucet enough cash for orders

    const order1Id = await john.placeOrder(
      yesNoMarket1.address,
      ORDER_TYPES.ASK,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('volumetric'),
    );
    const order2Id = await john.placeOrder(
      scalarMarket1.address,
      ORDER_TYPES.ASK,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('galvanize'),
    );

    await mary.fillOrder(
      order1Id,
      numShares.div(10),
      'volumetric',
    );
    await mary.fillOrder(
      order2Id,
      numShares.div(2),
      'galvanize',
    );

    const order3Id = await john.placeOrder(
      yesNoMarket1.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('oi'),
    );
    await mary.fillOrder(
      order3Id,
      numShares.div(2),
      'oi',
    );

    await (await db).sync(john.augur, CHUNK_SIZE, 0);
    const stats = await api.route('getCategoryStats', {
      universe: john.augur.contracts.universe.address,
      categories: [
        'yesno 2 primary', // we ignore case
        'Common', // we ignore case
        'categorical 2 secondary', // will be empty because it's never a primary category
        'nonexistent' // will be empty because it's never used as a category
      ],
    });
    expect(stats).toEqual({
      'yesno 2 primary': {
        category: 'yesno 2 primary',
        numberOfMarkets: 1,
        volume: '0.00',
        openInterest: '0.00',
        categories: {
          'yesno 2 secondary': {
            category: 'yesno 2 secondary',
            numberOfMarkets: 1,
            volume: '0.00',
            openInterest: '0.00',
            categories: {}
          }
        },
      },
      'common': {
        category: 'common',
        numberOfMarkets: 2,
        volume: '110000.00',
        openInterest: '90000.00',
        categories: {
          'yesno 1 secondary': {
            category: 'yesno 1 secondary',
            numberOfMarkets: 1,
            volume: '60000.00',
            openInterest: '40000.00',
            categories: {}
          },
          'scalar 1 secondary': {
            category: 'scalar 1 secondary',
            numberOfMarkets: 1,
            volume: '50000.00',
            openInterest: '50000.00',
            categories: {}
          }
        },
      },
      'categorical 2 secondary': {
        category: 'categorical 2 secondary',
        numberOfMarkets: 0,
        volume: '0.00',
        openInterest: '0.00',
        categories: {},
      },
      'nonexistent': {
        category: 'nonexistent',
        numberOfMarkets: 0,
        volume: '0.00',
        openInterest: '0.00',
        categories: {},
      },
    });
  });
});
