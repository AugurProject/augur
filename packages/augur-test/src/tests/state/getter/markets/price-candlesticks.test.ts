import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { ContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { ORDER_TYPES } from '@augurproject/sdk';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
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

  test(':getMarketPriceCandlesticks', async () => {
    const yesNoMarket = john.augur.contracts.marketFromAddress(markets['yesNoMarket1']);

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
});
