import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  GetMarketsSortBy,
  MarketList,
} from '@augurproject/sdk/build/state/getter/Markets';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { MarketReportingState } from '@augurproject/sdk/build/constants';
import { ACCOUNTS, ContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { ORDER_TYPES, SECONDS_IN_A_DAY } from '@augurproject/sdk';
import * as _ from 'lodash';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { NULL_ADDRESS, stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import {
  _beforeAll,
  _beforeEach,
  CHUNK_SIZE,
  outcome0,
  outcome1,
} from './common';

describe('State API :: Markets :: GetMarkets', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
  let bob: ContractAPI;

  let baseProvider: TestEthersProvider;
  let markets = {};

  beforeAll(async () => {
    const state = await _beforeAll();
    baseProvider = state.baseProvider;
    markets = state.markets;
  });

  beforeEach(async () => {
    const state = await _beforeEach({ baseProvider, markets });
    db = state.db;
    api = state.api;
    john = state.john;
    mary = state.mary;
    bob = state.bob;
  });

  // NOTE: Full-text searching is also tested in MarketDerivedDB.test.ts
  test('General', async () => {
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
    let marketIds = _.map(marketList.markets, 'id');
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
    const price = new BigNumber(50);
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
});
