import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  MarketInfo,
  MarketInfoReportingState,
  MarketOrderBook,
  SECONDS_IN_A_DAY,
} from '@augurproject/sdk/build/state/getter/Markets';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from "../../../libs";
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { NULL_ADDRESS, stringTo32ByteHex } from '../../../libs/Utils';
import { BigNumber } from 'bignumber.js';
import { ORDER_TYPES } from '@augurproject/sdk';
import { ContractInterfaces } from '@augurproject/core';

const mock = makeDbMock();

const outcome0 = new BigNumber(0);
const outcome1 = new BigNumber(1);
describe('State API :: Markets :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses);
    db = mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
  }, 120000);

  // NOTE: Full-text searching is tested more in SyncableDB.test.ts
  test(':getMarkets', async () => {
    const universe = john.augur.contracts.universe;
    const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
    const highFeePerCashInAttoCash = new BigNumber(10).pow(18).div(10); // 10% creator fee
    const affiliateFeeDivisor = new BigNumber(0);
    const designatedReporter = john.account.publicKey;
    const yesNoMarket1 = await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash: lowFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo: '{"categories": ["yesNo category 1"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1", "tags": ["yesNo tag1-1", "yesNo tag1-2", "yesNo tag1-3"]}',
    });
    const yesNoMarket2 = await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash: lowFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo: '{"categories": ["yesNo category 2"], "description": "yesNo description 2", "longDescription": "yesNo longDescription 2", "tags": ["yesNo tag2-1", "yesNo tag2-2", "yesNo tag2-3"]}',
    });
    const categoricalMarket1 = await john.createCategoricalMarket({
      endTime,
      feePerCashInAttoCash: lowFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      outcomes: [stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')],
      extraInfo: '{"categories": ["categorical category 1"], "description": "categorical description 1", "longDescription": "categorical longDescription 1", "tags": ["categorical tag1-1", "categorical tag1-2", "categorical tag1-3"]}',
    });
    const categoricalMarket2 = await john.createCategoricalMarket({
      endTime,
      feePerCashInAttoCash: highFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      outcomes: [stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')],
      extraInfo: '{"categories": ["categorical category 2"], "description": "categorical description 2", "longDescription": "categorical longDescription 2", "tags": ["categorical tag2-1", "categorical tag2-2", "categorical tag2-3"]}',
    });
    const scalarMarket1 = await john.createScalarMarket({
      endTime,
      feePerCashInAttoCash: highFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      prices: [new BigNumber(0), new BigNumber(100)],
      numTicks: new BigNumber(100),
      extraInfo: '{"categories": ["scalar category 1"], "description": "scalar description 1", "longDescription": "scalar longDescription 1", "_scalarDenomination": "scalar denom 1", "tags": ["scalar tag1-1", "scalar tag1-2", "scalar tag1-3"]}',
    });
    const scalarMarket2 = await john.createScalarMarket({
      endTime,
      feePerCashInAttoCash: highFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      prices: [new BigNumber(0), new BigNumber(100)],
      numTicks: new BigNumber(100),
      extraInfo: '{"categories": ["scalar category 2"], "description": "scalar description 2", "longDescription": "scalar longDescription 2", "_scalarDenomination": "scalar denom 2", "tags": ["scalar tag2-1", "scalar tag2-2", "scalar tag2-3"]}',
    });

    const actualDB = await db;
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);

    let markets: MarketInfo[];

    // Test non-existent universe address
    const nonexistentAddress = '0x1111111111111111111111111111111111111111';
    let errorMessage = '';
    try {
      const markets: MarketInfo[] = await api.route('getMarkets', {
        universe: nonexistentAddress,
      });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual(
      'Unknown universe: 0x1111111111111111111111111111111111111111'
    );

    // Test creator
    markets = await api.route('getMarkets', {
      universe: universe.address,
      creator: ACCOUNTS[0].publicKey,
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      creator: nonexistentAddress,
    });
    expect(markets).toEqual([]);

    // Test maxEndTime
    markets = await api.route('getMarkets', {
      universe: universe.address,
      maxEndTime: endTime.toNumber(),
    });
    expect(markets).toEqual([]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      maxEndTime: endTime.plus(1).toNumber(),
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);

    // Test designatedReporter
    markets = await api.route('getMarkets', {
      universe: universe.address,
      designatedReporter: ACCOUNTS[0].publicKey,
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      designatedReporter: nonexistentAddress,
    });
    expect(markets).toEqual([]);

    // Test maxFee
    markets = await api.route('getMarkets', {
      universe: universe.address,
      maxFee: '0.05',
    });
    expect(markets).toEqual([]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      maxFee: '0.06',
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
      categoricalMarket1.address,
    ]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      maxFee: '0.11',
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);

    // Place orders on some markets

    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);
    const yesNoOrderId = await john.placeOrder(
      yesNoMarket1.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.cancelOrder(yesNoOrderId);
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
      numShares,
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

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Test hasOrders
    markets = await api.route('getMarkets', {
      universe: universe.address,
      hasOrders: false,
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      hasOrders: true,
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    categoricalMarket1.address,
      scalarMarket1.address,
    ]);

    // Partially fill orders
    const cost = numShares.multipliedBy(78).div(2);
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
    await john.fillOrder(yesNoOrderId1, cost, numShares.div(2), '42');
    await mary.fillOrder(categoricalOrderId1, cost, numShares.div(2), '43');
    await mary.fillOrder(scalarOrderId1, cost, numShares.div(2), '43');

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      hasOrders: true,
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    categoricalMarket1.address,
      scalarMarket1.address,
    ]);

    // Completely fill orders
    await john.fillOrder(yesNoOrderId1, cost, numShares.div(2), '42');
    await mary.fillOrder(categoricalOrderId1, cost, numShares.div(2), '43');
    await mary.fillOrder(scalarOrderId1, cost, numShares.div(2), '43');

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      hasOrders: true,
    });
    expect(markets).toEqual([]);

    // Move timestamp to designated reporting phase
    await john.setTimestamp(endTime);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Test disputeWindow
    markets = await api.route('getMarkets', {
      universe: universe.address,
      disputeWindow: NULL_ADDRESS,
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);

    // Test reportingState
    markets = await api.route('getMarkets', {
      universe: universe.address,
      reportingState: MarketInfoReportingState.DESIGNATED_REPORTING,
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      reportingState: MarketInfoReportingState.PRE_REPORTING,
    });
    expect(markets).toEqual([]);

    await john.setTimestamp(endTime.plus(1));

    const noPayoutSet = [
      new BigNumber(100),
      new BigNumber(0),
      new BigNumber(0),
    ];
    await john.doInitialReport(yesNoMarket1, noPayoutSet);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Retest disputeWindow & reportingState
    const disputeWindow = await yesNoMarket1.getDisputeWindow_();
    markets = await api.route('getMarkets', {
      universe: universe.address,
      disputeWindow,
    });
    expect(markets).toEqual([yesNoMarket1.address]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      reportingState: MarketInfoReportingState.DESIGNATED_REPORTING,
    });
    expect(markets).toEqual([
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      reportingState: MarketInfoReportingState.CROWDSOURCING_DISPUTE,
    });
    expect(markets).toEqual([yesNoMarket1.address]);

    markets = await api.route('getMarkets', {
      universe: universe.address,
      reportingState: [
        MarketInfoReportingState.CROWDSOURCING_DISPUTE,
        MarketInfoReportingState.DESIGNATED_REPORTING,
      ],
    });
    expect(markets).toEqual([
    yesNoMarket1.address,
    yesNoMarket2.address,
    categoricalMarket1.address,
    categoricalMarket2.address,
    scalarMarket1.address,
      scalarMarket2.address,
    ]);
  }, 120000);

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
    const cost = numShares.multipliedBy(78).div(10);
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
      cost,
      numShares.div(10).multipliedBy(2),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      cost,
      numShares.div(10).multipliedBy(3),
      '43'
    );
    await mary.fillOrder(
      categoricalOrderId0,
      cost,
      numShares.div(10).multipliedBy(2),
      '43'
    );
    await mary.fillOrder(
      categoricalOrderId1,
      cost,
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
      cost,
      numShares.div(10).multipliedBy(4),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      cost,
      numShares.div(10).multipliedBy(5),
      '43'
    );
    await mary.fillOrder(
      categoricalOrderId0,
      cost,
      numShares.div(10).multipliedBy(4),
      '43'
    );
    await mary.fillOrder(
      categoricalOrderId1,
      cost,
      numShares.div(10).multipliedBy(2),
      '43'
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

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
  }, 120000);

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
      cost0,
      numShares.div(10).multipliedBy(5),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      cost1,
      numShares.div(10).multipliedBy(7),
      '43'
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
      cost1,
      numShares.div(10).multipliedBy(4),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      cost0,
      numShares.div(10).multipliedBy(4),
      '43'
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
      cost0,
      numShares.div(10).multipliedBy(6),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      cost1,
      numShares.div(10).multipliedBy(8),
      '43'
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
      cost1,
      numShares.div(10).multipliedBy(7),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      cost1,
      numShares.div(10).multipliedBy(9),
      '43'
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
      cost2,
      numShares.div(10).multipliedBy(6),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      cost1,
      numShares.div(10).multipliedBy(5),
      '43'
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
      cost0,
      numShares.div(10).multipliedBy(7),
      '42'
    );
    await mary.fillOrder(
      yesNoOrderId1,
      cost3,
      numShares.div(10).multipliedBy(3),
      '43'
    );

    // Move time forward 60 minutes
    newTime = (await john.getTimestamp()).plus(60 * 60);
    await john.setTimestamp(newTime);

    const endTime = (await john.getTimestamp()).toNumber();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

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
  }, 120000);

  describe(':getMarketOrderBook', () => {
    const askOrderAddresses = [];
    const bidOrderAddresses = [];

    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);

    let yesNoMarket: ContractInterfaces.Market;

    beforeAll(async () => {
      yesNoMarket = await john.createReasonableYesNoMarket();

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

      await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    }, 120000);

    test('should require marketId', async () => {
      await expect(api.route('getMarketOrderBook', {})).rejects.toThrowError();
    });

    describe('outcomeId', () => {
      test('can be a single value', async () => {
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
      const orderBook = (await api.route('getMarketOrderBook', {
        marketId: yesNoMarket.address,
      })) as MarketOrderBook;

      expect(orderBook).toEqual({
        marketId: yesNoMarket.address,
        orderBook: {
          [outcome0.toString()]: {
            spread: "0",
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
            spread: "0",
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
      const maryApi = new API(mary.augur, db);
      const orderBook = (await maryApi.route('getMarketOrderBook', {
        marketId: yesNoMarket.address,
      })) as MarketOrderBook;

      expect(orderBook).toMatchObject({
        marketId: yesNoMarket.address,
        orderBook: {
          [outcome0.toString()]: {
            spread: "0",
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
            spread: "0",
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

  test(':getMarketsInfo', async () => {
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
    const cost = numShares.multipliedBy(78).div(2);
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
    await john.fillOrder(yesNoOrderId0, cost, numShares.div(2), '42');
    await mary.fillOrder(yesNoOrderId1, cost, numShares.div(2), '43');
    await mary.fillOrder(categoricalOrderId0, cost, numShares.div(2), '43');
    await mary.fillOrder(categoricalOrderId1, cost, numShares.div(2), '43');
    await mary.fillOrder(scalarOrderId0, cost, numShares.div(2), '43');
    await mary.fillOrder(scalarOrderId1, cost, numShares.div(2), '43');

    // Purchase complete sets
    await mary.buyCompleteSets(yesNoMarket, numShares);
    await mary.buyCompleteSets(categoricalMarket, numShares);
    await mary.buyCompleteSets(scalarMarket, numShares);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    let markets: MarketInfo[] = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketInfoReportingState.PRE_REPORTING
    );
    expect(markets[1].reportingState).toBe(
      MarketInfoReportingState.PRE_REPORTING
    );
    expect(markets[2].reportingState).toBe(
      MarketInfoReportingState.PRE_REPORTING
    );

    // Skip to yes/no market end time
    let newTime = (await yesNoMarket.getEndTime_()).plus(1);
    await john.setTimestamp(newTime);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketInfoReportingState.DESIGNATED_REPORTING
    );
    expect(markets[1].reportingState).toBe(
      MarketInfoReportingState.DESIGNATED_REPORTING
    );
    expect(markets[2].reportingState).toBe(
      MarketInfoReportingState.DESIGNATED_REPORTING
    );

    // Skip to open reporting
    newTime = newTime.plus(SECONDS_IN_A_DAY.times(7));
    await john.setTimestamp(newTime);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketInfoReportingState.OPEN_REPORTING
    );
    expect(markets[1].reportingState).toBe(
      MarketInfoReportingState.OPEN_REPORTING
    );
    expect(markets[2].reportingState).toBe(
      MarketInfoReportingState.OPEN_REPORTING
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

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketInfoReportingState.CROWDSOURCING_DISPUTE
    );
    expect(markets[1].reportingState).toBe(
      MarketInfoReportingState.CROWDSOURCING_DISPUTE
    );
    expect(markets[2].reportingState).toBe(
      MarketInfoReportingState.OPEN_REPORTING
    );

    // Dispute 10 times
    for (let disputeRound = 1; disputeRound <= 11; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        await mary.contribute(yesNoMarket, yesPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket,
          yesPayoutSet
        );
        await mary.contribute(yesNoMarket, yesPayoutSet, remainingToFill);
      } else {
        await john.contribute(yesNoMarket, noPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket,
          noPayoutSet
        );
        await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);
      }
    }

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketInfoReportingState.AWAITING_NEXT_WINDOW
    );
    expect(markets[1].reportingState).toBe(
      MarketInfoReportingState.CROWDSOURCING_DISPUTE
    );
    expect(markets[2].reportingState).toBe(
      MarketInfoReportingState.OPEN_REPORTING
    );

    newTime = newTime.plus(SECONDS_IN_A_DAY.times(7));
    await john.setTimestamp(newTime);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets[0].reportingState).toBe(
      MarketInfoReportingState.CROWDSOURCING_DISPUTE
    );
    expect(markets[1].reportingState).toBe(
      MarketInfoReportingState.CROWDSOURCING_DISPUTE
    );
    expect(markets[2].reportingState).toBe(
      MarketInfoReportingState.OPEN_REPORTING
    );

    // Continue disputing
    for (let disputeRound = 12; disputeRound <= 19; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        await mary.contribute(yesNoMarket, yesPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket,
          yesPayoutSet
        );
        await mary.contribute(yesNoMarket, yesPayoutSet, remainingToFill);
      } else {
        await john.contribute(yesNoMarket, noPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket,
          noPayoutSet
        );
        await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);
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
    await john.contribute(yesNoMarket, noPayoutSet, remainingToFill);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    markets = await api.route('getMarketsInfo', {
      marketIds: [
        yesNoMarket.address,
        categoricalMarket.address,
        scalarMarket.address,
      ],
    });

    expect(markets).toMatchObject([
      {
        author: john.account.publicKey,
        categories:
          [' '],
        consensus: null,
        cumulativeScale: '1',
        details: null,
        finalizationTime: null,
        marketType: 'yesNo',
        maxPrice: '1',
        minPrice: '0',
        needsMigration: false,
        numOutcomes: 3,
        numTicks: '100',
        openInterest: '0.0015',
        outcomes: [
          {
            description: 'Invalid',
            id: 0,
            price: '0.22',
            volume: '500000000000000',
          },
          {
            description: 'No',
            id: 1,
            price: '0.22',
            volume: '500000000000000',
          },
          {
            description: 'Yes',
            id: 2,
            price: null,
            volume: '0',
          },
        ],
        reportingState: 'FORKING',
        resolutionSource: null,
        scalarDenomination: null,
        marketCreatorFeeRate: '0.01',
        settlementFee: '0.0100000000000001',
        reportingFeeRate: '0.0000000000000001',
        tickSize: '0.01',
        universe: john.augur.contracts.universe.address,
        volume: '0.001',
        disputeInfo: {
          disputePacingOn: true,
          stakeCompletedTotal: '550000000000000000524288',
          bondSizeOfNewStake: '1100000000000000001048576',
          stakes: [
            {
              outcome: '1',
              isInvalid: false,
              bondSizeCurrent: '349680582682291667',
              bondSizeTotal: '366666666666666667016192',
              stakeCurrent: '349680582682291667',
              stakeRemaining: '0',
              stakeCompleted: '366666666666666667016192',
              tentativeWinning: true },
            {
              outcome: '2',
              isInvalid: false,
              bondSizeCurrent: '699361165364583334',
              bondSizeTotal: '183333333333333333508096',
              stakeCurrent: '699361165364583334',
              stakeRemaining: '0',
              stakeCompleted: '183333333333333333508096',
              tentativeWinning: false,
            },
          ],
        },
      },
      {
        author: john.account.publicKey,
        categories:
          [' '],
        consensus: ['100', '0', '0', '0'],
        cumulativeScale: '1',
        details: null,
        marketType: 'categorical',
        maxPrice: '1',
        minPrice: '0',
        needsMigration: false,
        numOutcomes: 4,
        numTicks: '100',
        openInterest: '0.0015',
        outcomes: [
          {
            description: 'Invalid',
            id: 0,
            price: '0.22',
            volume: '500000000000000',
          },
          {
            description:
              'A\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
            id: 1,
            price: '0.22',
            volume: '110000000000000',
          },
          {
            description:
              'B\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
            id: 2,
            price: null,
            volume: '0',
          },
          {
            description:
              'C\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
            id: 3,
            price: null,
            volume: '0',
          },
        ],
        reportingState: 'FINALIZED',
        resolutionSource: null,
        scalarDenomination: null,
        marketCreatorFeeRate: '0.01',
        settlementFee: '0.0100000000000001',
        reportingFeeRate: '0.0000000000000001',
        tickSize: '0.01',
        universe: john.augur.contracts.universe.address,
        volume: '0.00061',
        disputeInfo: {
          disputePacingOn: false,
          stakeCompletedTotal: '349680582682291667',
          bondSizeOfNewStake: '699361165364583334',
          stakes: [
            {
              outcome: '0',
              isInvalid: true,
              bondSizeCurrent: '349680582682291667',
              bondSizeTotal: '349680582682291667',
              stakeCurrent: '349680582682291667',
              stakeRemaining: '0',
              stakeCompleted: '349680582682291667',
              tentativeWinning: true,
            },
          ],
        },
      },
      {
        author: john.account.publicKey,
        categories:
          [' '],
        consensus: null,
        cumulativeScale: '200',
        details: null,
        finalizationTime: null,
        marketType: 'scalar',
        maxPrice: '250',
        minPrice: '50',
        needsMigration: true,
        numOutcomes: 3,
        numTicks: '20000',
        openInterest: '0.3',
        scalarDenomination: 'scalar denom 1',
        marketCreatorFeeRate: '0.01',
        settlementFee: '0.0100000000000001',
        reportingFeeRate: '0.0000000000000001',
        outcomes: [
          {
            description: 'Invalid',
            id: 0,
            price: '50.22',
            volume: '100000000000000000',
          },
          {
            description: 'scalar denom 1',
            id: 1,
            price: '50.22',
            volume: '110000000000000',
          },
          {
            description: 'scalar denom 1',
            id: 2,
            price: null,
            volume: '0',
          },
        ],
        reportingState: 'AWAITING_FORK_MIGRATION',
        resolutionSource: null,
        tickSize: '0.01',
        universe: john.augur.contracts.universe.address,
        volume: '0.10011',
        disputeInfo: {
          disputePacingOn: false,
          stakeCompletedTotal: '0',
          bondSizeOfNewStake: '0',
          stakes: [],
        },
      },
    ]);

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
  }, 180000);

  test(':getCategories', async () => {
    const categories = await api.route('getCategories', {
      universe: john.augur.contracts.universe.address,
    });
    expect(categories).toMatchObject([
    'yesNo category 1',
    'yesNo category 2',
    'categorical category 1',
    'categorical category 2',
    'scalar category 1',
    'scalar category 2',
    ' ',
    ]);
  }, 120000);
});
