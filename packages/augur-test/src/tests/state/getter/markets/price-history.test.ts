import { ORDER_TYPES, SECONDS_IN_A_DAY } from '@augurproject/sdk-lite';
import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { _beforeAll, _beforeEach, outcome0, outcome1 } from './common';

describe('State API :: Markets :: GetMarkets', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;

  let baseProvider: TestEthersProvider;
  let markets = {};

  beforeAll(async () => {
    const state = await _beforeAll();
    baseProvider = state.baseProvider;
    markets = state.markets;
  });

  beforeEach(async () => {
    const state = await _beforeEach({ baseProvider, markets });

    john = state.john;
    mary = state.mary;
    bob = state.bob;
  });

  test(':getMarketPriceHistory', async () => {
    const yesNoMarket = john.augur.contracts.marketFromAddress(
      markets['yesNoMarket1']
    );
    const categoricalMarket = john.augur.contracts.marketFromAddress(
      markets['categoricalMarket1']
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
    await john.faucetCash(new BigNumber(1e18)); // faucet enough cash for the various fill orders
    await mary.faucetCash(new BigNumber(1e18)); // faucet enough cash for the various fill orders
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

    await john.sync();

    const yesNoMarketPriceHistory = await john.api.route(
      'getMarketPriceHistory',
      {
        marketId: yesNoMarket.address,
      }
    );
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

    const categoricalMarketPriceHistory = await john.api.route(
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
        ).toHaveProperty('timestamp');
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
});
