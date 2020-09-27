import { ORDER_TYPES } from '@augurproject/sdk-lite';
import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { _beforeAll, _beforeEach, outcome1 } from './common';

describe('State API :: Markets :: Categories', () => {
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

  test(':getCategoryStats', async () => {
    const yesNoMarket1 = john.augur.contracts.marketFromAddress(
      markets['yesNoMarket1']
    );
    const scalarMarket1 = john.augur.contracts.marketFromAddress(
      markets['scalarMarket1']
    );

    const numShares = new BigNumber(1e21);
    const price = new BigNumber(22);

    await john.faucetCash(new BigNumber(1e25)); // faucet enough cash for orders
    await mary.faucetCash(new BigNumber(1e25)); // faucet enough cash for orders

    const order1Id = await john.placeOrder(
      yesNoMarket1.address,
      ORDER_TYPES.ASK,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('volumetric')
    );
    const order2Id = await john.placeOrder(
      scalarMarket1.address,
      ORDER_TYPES.ASK,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('galvanize')
    );

    await mary.fillOrder(order1Id, numShares.div(10), 'volumetric');
    await mary.fillOrder(order2Id, numShares.div(2), 'galvanize');

    const order3Id = await john.placeOrder(
      yesNoMarket1.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('oi')
    );
    await mary.fillOrder(order3Id, numShares.div(2), 'oi');

    await john.sync();
    const stats = await john.api.route('getCategoryStats', {
      universe: john.augur.contracts.universe.address,
      categories: [
        'yesno 2 primary', // we ignore case
        'Common', // we ignore case
        'categorical 2 secondary', // will be empty because it's never a primary category
        'nonexistent', // will be empty because it's never used as a category
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
            categories: {},
          },
        },
      },
      common: {
        category: 'common',
        numberOfMarkets: 2,
        volume: '650000.00',
        openInterest: '450000.00',
        categories: {
          'yesno 1 secondary': {
            category: 'yesno 1 secondary',
            numberOfMarkets: 1,
            volume: '600000.00',
            openInterest: '400000.00',
            categories: {},
          },
          'scalar 1 secondary': {
            category: 'scalar 1 secondary',
            numberOfMarkets: 1,
            volume: '50000.00',
            openInterest: '50000.00',
            categories: {},
          },
        },
      },
      'categorical 2 secondary': {
        category: 'categorical 2 secondary',
        numberOfMarkets: 0,
        volume: '0.00',
        openInterest: '0.00',
        categories: {},
      },
      nonexistent: {
        category: 'nonexistent',
        numberOfMarkets: 0,
        volume: '0.00',
        openInterest: '0.00',
        categories: {},
      },
    });
  });
});
