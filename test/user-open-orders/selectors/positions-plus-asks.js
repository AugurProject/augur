import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';

describe('modules/user-open-orders/selectors/positions-plus-asks', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state || {});
      t.assertions(store);
    });
  };

  describe('selectAccountPositions', () => {
    const positionsPlusAsks = require('modules/user-open-orders/selectors/positions-plus-asks');

    positionsPlusAsks.__Rewire__('selectPositionsPlusAsks', () => 'selectPositionsPlusAsks');

    test({
      description: `should call the expected methods`,
      assertions: () => {
        const actual = positionsPlusAsks.selectAccountPositions();

        const expected = 'selectPositionsPlusAsks';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });
  });

  describe('selectPositionsPlusAsks', () => {
    const positionsPlusAsks = require('modules/user-open-orders/selectors/positions-plus-asks');

    positionsPlusAsks.__Rewire__('selectMarketPositionPlusAsks', () => 'selectMarketPositionPlusAsks');

    test({
      description: `should return the expected value with no positions`,
      state: {
        loginAccount: {}
      },
      assertions: (store) => {
        const actual = positionsPlusAsks.selectPositionsPlusAsks(store.getState());

        const expected = null;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected value with positions and no market order book`,
      state: {
        loginAccount: {},
        accountPositions: {
          '0xMARKETID': {}
        },
        orderBooks: {}
      },
      assertions: (store) => {
        const actual = positionsPlusAsks.selectPositionsPlusAsks(store.getState());

        const expected = {};

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected value with positions and no market order book`,
      state: {
        loginAccount: {},
        accountPositions: {
          '0xMARKETID': {}
        },
        orderBooks: {}
      },
      assertions: (store) => {
        const actual = positionsPlusAsks.selectPositionsPlusAsks(store.getState());

        const expected = {};

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected value with positions and market order book`,
      state: {
        loginAccount: {},
        accountPositions: {
          '0xMARKETID': {}
        },
        orderBooks: {
          '0xMARKETID': {}
        }
      },
      assertions: (store) => {
        const actual = positionsPlusAsks.selectPositionsPlusAsks(store.getState());

        const expected = {
          '0xMARKETID': 'selectMarketPositionPlusAsks'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });
  });
});
