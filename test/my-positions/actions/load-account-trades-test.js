import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

describe('modules/my-positions/actions/load-account-trades.js', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const { loadAccountTrades, __RewireAPI__ } = require('modules/my-positions/actions/load-account-trades');
  const METHODS = {
    getTradeHistory: 'getTradeHistory',
    getPayoutHistory: 'getPayoutHistory'
  };
  const MOCK_ACTION_TYPES = {
    CLEAR_ACCOUNT_TRADES: 'CLEAR_ACCOUNT_TRADES',
    UPDATE_ACCOUNT_TRADES_DATA: 'UPDATE_ACCOUNT_TRADES_DATA',
    CONVERT_LOGS_TO_TRANSACTIONS: 'CONVERT_LOGS_TO_TRANSACTIONS'
  };

  __RewireAPI__.__Rewire__('clearAccountTrades', () => ({
    type: MOCK_ACTION_TYPES.CLEAR_ACCOUNT_TRADES
  }));
  __RewireAPI__.__Rewire__('updateAccountTradesData', (trades, market) => (
    { type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA }
  ));
  __RewireAPI__.__Rewire__('convertLogsToTransactions', (type, payouts) => ({
    type: MOCK_ACTION_TYPES.CONVERT_LOGS_TO_TRANSACTIONS,
    data: {
      type,
      payouts
    }
  }));

  afterEach(() => {
    __RewireAPI__.__ResetDependency__('loadDataFromAugurNode', 'convertLogsToTransactions', 'clearAccountTrades', 'updateAccountTradesData');
  });

  const test = t => it(t.description, (done) => {
    __RewireAPI__.__Rewire__('loadDataFromAugurNode', t.loadDataFromAugurNode);

    const store = mockStore(t.state || {});
    store.dispatch(loadAccountTrades(t.params, (err) => {
      t.assertions(err, store);
      done();
    }));
  });

  describe('loadAccountTrades', () => {
    test({
      description: `should call callback if no account present, no actions fired`,
      state: {
        loginAccount: {},
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeURL: 'blah.com'
        }
      },
      params: {},
      assertions: (err, store) => {
        const actualActions = store.getActions();
        const expected = [];
        assert.isNull(err, 'no error returned');
        assert.deepEqual(actualActions, expected, 'only clear action fired');
      }
    });

    test({
      description: `should call callback if no market present, clear action fired`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        },
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeURL: 'blah.com'
        }
      },
      loadDataFromAugurNode: (url, method, query, callback) => {
        callback(null, null);
      },
      params: {},
      assertions: (err, store) => {
        const actualActions = store.getActions();
        const expected = [{
          type: MOCK_ACTION_TYPES.CLEAR_ACCOUNT_TRADES
        },
        {
          type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA
        }
        ];
        assert.isNull(err, 'no error returned');
        assert.deepEqual(actualActions, expected, 'only clear action fired');
      }
    });

    test({
      description: `should dispatch the expected actions WITHOUT market param`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        },
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeURL: 'blah.com'
        }
      },
      loadDataFromAugurNode: (url, method, query, callback) => {
        callback(null, []);
      },
      params: {},
      assertions: (err, store) => {
        const actualActions = store.getActions();

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.CLEAR_ACCOUNT_TRADES
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA
          }
        ];

        assert.isNull(err, 'no error returned');
        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected actions`);

      }
    });

    test({
      description: `should dispatch the expected actions WITH market param, empty trade history`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        },
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeURL: 'blah.com'
        }
      },
      loadDataFromAugurNode: (url, method, query, callback) => {
        if (method === METHODS.getTradeHistory) {
          callback(null, []);
        } else {
          callback(null, [
            { type: 'payout', payouts: ['test'] }
          ]);
        }
      },
      params: { market: '0xMARKETID' },
      assertions: (err, store) => {
        const actualActions = store.getActions();

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA,
          },
          {
            type: MOCK_ACTION_TYPES.CONVERT_LOGS_TO_TRANSACTIONS,
            data: {
              payouts: [{
                type: 'payout',
                payouts: ['test']
              }],
              type: 'Payout'
            }
          }
        ];

        assert.isNull(err, 'no error returned');
        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected actions`);

      }
    });

    test({
      description: `should dispatch the expected actions WITH market param AND err returned for trade history`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        },
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeURL: 'blah.com'
        }
      },
      loadDataFromAugurNode: (url, method, query, callback) => {
        if (method === METHODS.getTradeHistory) {
          callback('ERROR', null);
        } else {
          callback(null, [
            { type: 'payout', payouts: ['test'] }
          ]);
        }
      },
      params: { market: '0xMARKETID' },
      assertions: (err, store) => {
        const actualActions = store.getActions();
        const expectedActions = [];

        assert.deepEqual(err, 'ERROR', 'error was returned');
        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected no actions`);
      }
    });

    test({
      description: `should dispatch the expected actions WITH market param AND payout history is array and trade history populated`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        },
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeURL: 'blah.com'
        }
      },
      loadDataFromAugurNode: (url, method, query, callback) => {
        if (method === METHODS.getTradeHistory) {
          callback(null, { type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA });
        } else {
          callback(null,
            [{ type: 'payout', payouts: ['test'] }]
          );
        }
      },
      params: { market: '0xMARKETID' },
      assertions: (err, store) => {
        const actualActions = store.getActions();
        const expectedActions = [{ type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA }, {
          type: MOCK_ACTION_TYPES.CONVERT_LOGS_TO_TRANSACTIONS,
          data: {
            type: 'Payout',
            payouts: [{ type: 'payout', payouts: ['test'] }]
          }
        }];

        assert.isNull(err, 'error not returned');
        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected no actions`);
      }
    });

    test({
      description: `should dispatch the expected actions with NULL options`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        },
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeURL: 'blah.com'
        }
      },
      loadDataFromAugurNode: null,
      params: null,
      assertions: (err, store) => {
        const actualActions = store.getActions();
        const expectedActions = [];
        assert.isNull(err, 'no error returned');
        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected no actions`);
      }
    });

    test({
      description: `should dispatch the expected actions WITH market param AND payout history is not array and trade history is not empty`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        },
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeURL: 'blah.com'
        }
      },
      loadDataFromAugurNode: (url, method, query, callback) => {
        if (method === METHODS.getTradeHistory) {
          callback(null, { type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA });
        } else {
          callback(null,
            { type: 'payout', payouts: ['test'] }
          );
        }
      },
      params: { market: '0xMARKETID' },
      assertions: (err, store) => {
        const actualActions = store.getActions();
        const expectedActions = [{ type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA }];

        assert.isNull(err, 'error not returned');
        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected no actions`);
      }
    });
  });
});
