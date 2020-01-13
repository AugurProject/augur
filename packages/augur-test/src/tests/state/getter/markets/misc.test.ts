import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  MarketInfo,
  MarketList,
  MarketOrderBook
} from '@augurproject/sdk/build/state/getter/Markets';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { MarketReportingState } from '@augurproject/sdk/build/constants';
import { ACCOUNTS, ContractAPI} from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { ORDER_TYPES, SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { getAddress } from 'ethers/utils/address';
import * as _ from 'lodash';
import { makeDbMock} from '../../../../libs';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import {
  _beforeAll,
  _beforeEach,
  CHUNK_SIZE,
  outcome0,
  outcome1,
} from './common';

describe('State API :: Markets :: ', () => {
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
    const marketIds = _.map(marketList.markets, 'id')
    expect(marketIds).toContain(categoricalMarket1.address);
    expect(marketIds).toContain(categoricalMarket2.address);
    expect(marketIds).toContain(yesNoMarket1.address);
    expect(marketIds).toContain(yesNoMarket2.address);
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
          onChain: true,
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
          onChain: true,
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
          onChain: true,
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
        onChain: true,
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
        onChain: true,
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
});
