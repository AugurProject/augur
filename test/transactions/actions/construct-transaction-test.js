import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

// import {
//   loadDataForMarketTransaction
// } from 'modules/transactions/actions/construct-transaction';

describe('modules/transactions/actions/contruct-transaction.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const MOCK_ACTION_TYPES = {
    CALLBACK: 'CALLBACK',
    LOAD_MARKET_THEN_RETRY_CONVERSION: 'LOAD_MARKET_THEN_RETRY_CONVERSION'
  };

  describe('loadDataForMarketTransaction', () => {
    const mockLoadMarketThenRetryConversion = {
      loadMarketThenRetryConversion: sinon.stub().returns({
        type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
      })
    };
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      './retry-conversion': mockLoadMarketThenRetryConversion
    });

    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state || {});

        t.assertions(store);
      });
    };

    test({
      description: `should return expected actions with no loaded markets`,
      state: {
        marketsData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
        };
        const isRetry = false;
        const callback = () => ({
          type: MOCK_ACTION_TYPES.CALLBACK
        });

        store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't return the expected actions`);
      }
    });
  });
});
