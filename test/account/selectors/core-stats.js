import { describe, it } from 'mocha';
import { assert } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import BigNumber from 'bignumber.js';

import { selectOutcomeLastPrice, createPeriodPLSelector, __RewireAPI__ as CoreStatsRewireAPI } from 'modules/account/selectors/core-stats';

import { ZERO } from 'modules/trade/constants/numbers';

describe('modules/account/selectors/core-stats', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {});
    t.assertions(store);
  });

  describe('selectOutcomeLastPrice', () => {
    test({
      description: `should return null when 'marketOutcomeData' is undefined`,
      assertions: () => {
        const actual = selectOutcomeLastPrice(undefined, 1);

        const expected = null;

        assert.strictEqual(actual, expected, `didn't return null as expected`);
      }
    });

    test({
      description: `should return null when 'outcomeID' is undefined`,
      assertions: () => {
        const actual = selectOutcomeLastPrice({}, undefined);

        const expected = null;

        assert.strictEqual(actual, expected, `didn't return null as expected`);
      }
    });

    test({
      description: `should return the expected price`,
      assertions: () => {
        const actual = selectOutcomeLastPrice({ 1: { price: '0.1' } }, 1);

        const expected = '0.1';

        assert.strictEqual(actual, expected, `didn't return the expected price`);
      }
    });

    test({
      description: `should return the expected price`,
      assertions: () => {
        const actual = selectOutcomeLastPrice({ 2: { price: '0.1' } }, 1);

        const expected = undefined;

        assert.strictEqual(actual, expected, `didn't return the expected price`);
      }
    });
  });

  describe('createPeriodPLSelector', function () { // eslint-disable-line func-names, prefer-arrow-callback
    after(() => {
      this.clock.restore();
    });

    test({
      description: `should return null when 'accountTrades' is undefined`,
      state: {
        blockchain: {}
      },
      assertions: (store) => {
        const selector = createPeriodPLSelector(1);

        const actual = selector(store.getState());

        const expected = null;

        assert.strictEqual(actual, expected, `didn't return null as expected`);
      }
    });

    test({
      description: `should return null when 'blockchain' is undefined`,
      state: {
        accountTrades: {}
      },
      assertions: (store) => {
        const selector = createPeriodPLSelector(1);

        const actual = selector(store.getState());

        const expected = null;

        assert.strictEqual(actual, expected, `didn't return null as expected`);
      }
    });

    test({
      description: `should return 0 for a set period with no trades`,
      state: {
        accountTrades: {
          '0xMarketID1': {
            1: [
              {
                blockNumber: 90000
              },
              {
                blockNumber: 90001
              }
            ],
            2: [
              {
                blockNumber: 90000
              },
              {
                blockNumber: 90001
              }
            ]
          }
        },
        blockchain: {
          currentBlockNumber: 100000
        },
        outcomesData: {
          '0xMarketID1': {}
        }
      },
      assertions: (store) => {
        this.clock = sinon.useFakeTimers(1485907200000);

        const selector = createPeriodPLSelector(1);

        const actual = selector(store.getState());

        const expected = ZERO;

        this.clock.restore();

        assert.deepEqual(actual, expected, `didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected value for a set period with trades`,
      state: {
        accountTrades: {
          '0xMarketID1': {
            1: [
              {
                blockNumber: 95000
              },
              {
                blockNumber: 96000
              }
            ],
            2: [
              {
                blockNumber: 95000
              },
              {
                blockNumber: 96000
              }
            ]
          }
        },
        blockchain: {
          currentBlockNumber: 100000
        },
        outcomesData: {
          '0xMarketID1': {}
        }
      },
      assertions: (store) => {
        this.clock = sinon.useFakeTimers(1485907200000);

        CoreStatsRewireAPI.__Rewire__('selectOutcomeLastPrice', () => '0.2');
        CoreStatsRewireAPI.__Rewire__('augur', {
          calculateProfitLoss: () => ({
            realized: '-1',
            unrealized: '2'
          })
        });

        const selector = createPeriodPLSelector(1);

        const actual = selector(store.getState());

        const expected = new BigNumber('2');

        CoreStatsRewireAPI.__ResetDependency__('selectOutcomeLastPrice');
        CoreStatsRewireAPI.__ResetDependency__('augur');
        this.clock.restore();

        assert.deepEqual(actual, expected, `didn't return the expected value`);
      }
    });
  });
});
