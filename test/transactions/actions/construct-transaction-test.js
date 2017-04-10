import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { formatRealEther } from 'utils/format-number';
import { formatDate } from 'utils/format-date';

import {
  constructBasicTransaction,
  constructDefaultTransaction
} from 'modules/transactions/actions/construct-transaction';

describe('modules/transactions/actions/contruct-transaction.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const MOCK_ACTION_TYPES = {
    LOAD_MARKET_THEN_RETRY_CONVERSION: 'LOAD_MARKET_THEN_RETRY_CONVERSION',
    LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION: 'LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION'
  };

  const mockRetryConversion = {
    loadMarketThenRetryConversion: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
    }),
    lookupEventMarketsThenRetryConversion: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION
    })
  };

  const mockMarket = {
    selectMarketIDFromEventID: sinon.stub()
  };
  mockMarket.selectMarketIDFromEventID.withArgs(undefined).returns(null);
  mockMarket.selectMarketIDFromEventID.withArgs('0xEVENTID').returns('0xMARKETID');

  describe('loadDataForMarketTransaction', () => {
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      './retry-conversion': mockRetryConversion
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
        const callback = () => {};

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

    test({
      description: `should return expected actions with no loaded markets AND isRetry`,
      state: {
        marketsData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
        };
        const isRetry = true;
        const callback = sinon.spy();

        store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback));

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`);
      }
    });

    test({
      description: `should return expected actions with loaded markets`,
      state: {
        marketsData: {
          '0xMARKETID': {
            description: 'market is loaded'
          }
        }
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

        const actual = store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback));

        const expected = {
          description: 'market is loaded'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('loadDataForReportingTransaction', () => {
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      './retry-conversion': mockRetryConversion,
      '../../market/selectors/market': mockMarket
    });

    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state || {});

        t.assertions(store);
      });
    };

    test({
      description: `should dispatch the expected actions with no markets loaded and no eventMarketMap`,
      state: {
        marketsData: {},
        outcomesData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
          // Lack of event market map is mocked by excluding the event
        };
        const isRetry = false;
        const callback = () => {};

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't return the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions with no markets loaded and no eventMarketMap and isRetry`,
      state: {
        marketsData: {},
        outcomesData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
          // Lack of event market map is mocked by excluding the event
        };
        const isRetry = true;
        const callback = sinon.stub();

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`);
      }
    });

    test({
      description: `should dispatch the expected actions with no markets loaded and with an eventMarketMap`,
      state: {
        marketsData: {},
        outcomesData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID',
          event: '0xEVENTID'
        };
        const isRetry = false;
        const callback = () => {};

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't return the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions with no markets loaded and with an eventMarketMap and isRetry`,
      state: {
        marketsData: {},
        outcomesData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID',
          event: '0xEVENTID'
        };
        const isRetry = true;
        const callback = sinon.stub();

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`);
      }
    });

    test({
      description: `should return the expected object with markets loaded and with an eventMarketMap`,
      state: {
        marketsData: {
          '0xMARKETID': {
            description: 'testing'
          }
        },
        outcomesData: {
          '0xMARKETID': {}
        }
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID',
          event: '0xEVENTID'
        };
        const isRetry = false;
        const callback = sinon.stub();

        const result = store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        const expected = {
          marketID: '0xMARKETID',
          market: {
            description: 'testing'
          },
          outcomes: {}
        };

        assert.deepEqual(result, expected, `Didn't return the expected actions`);
      }
    });
  });

  describe('constructBasicTransaction', () => {
    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: 'should return the expected object with no arguments passed',
      assertions: (store) => {
        const actual = store.dispatch(constructBasicTransaction());

        const expected = {
          hash: undefined,
          status: undefined
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: 'should return the expected object with just hash and status passed',
      assertions: (store) => {
        const hash = '0xHASH';
        const status = 'status';

        const actual = store.dispatch(constructBasicTransaction(hash, status));

        const expected = {
          hash,
          status
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: 'should return the expected object with all arguments passed',
      assertions: (store) => {
        const hash = '0xHASH';
        const status = 'status';
        const blockNumber = 123456;
        const timestamp = 1491843278;
        const gasFees = 0.001;


        const actual = store.dispatch(constructBasicTransaction(hash, status, blockNumber, timestamp, gasFees));

        const expected = {
          hash,
          status,
          blockNumber,
          timestamp: formatDate(new Date(timestamp * 1000)),
          gasFees: formatRealEther(gasFees)
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructDefaultTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: 'should return the expected object',
      assertions: () => {
        const label = 'transaction';
        const log = {
          message: 'log message',
          description: 'log description'
        };

        const actual = constructDefaultTransaction(label, log);

        const expected = {
          data: {},
          type: label,
          message: 'log message',
          description: 'log description'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });
});
