import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/transactions/actions/trigger-transactions-export.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const doc = global.document;

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const action = proxyquire('../../../src/modules/transactions/actions/trigger-transactions-export', {
        '../selectors/transactions': t.transactionsSelector,
        '../../auth/actions/load-account-history': t.loadAccountHistory,
      });

      global.document = t.document;

      store.dispatch(action.triggerTransactionsExport());
      t.assertions(store.getActions(), t.expectedOutput);

      global.document = doc;
    });
  };
  test({
    description: 'should download if all transactions are loaded',
    state: {
      transactions: [{ id: 1, text: 'a transaction' }, { id: 2, text: 'another transaction' }],
      transactionsLoading: false,
      transactionsOldestLoadedBlock: 100,
      loginAccount: { registerBlockNumber: 100 },
    },
    transactionsSelector: {
      selectTransactions: state => state.transactions
    },
    loadAccountHistory: {
      loadAccountHistory: loadAll => ({ type: 'LOAD_ACCOUNT_HISTORY', loadAll })
    },
    document: {
      createElement: (type) => {
        assert.equal(type, 'a');
        return {
          setAttribute: (type, value) => {
            switch (type) {
              case 'href':
                return assert.deepEqual(value, 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify([{ id: 1, text: 'a transaction' }, { id: 2, text: 'another transaction' }])));
              case 'download':
                return assert.deepEqual(value, 'AugurTransactions.json');
              default:
                return assert.isFalse(true, 'call to setAttribute with unexpected values');
            }
          },
          click: () => {}
        };
      }
    },
    expectedOutput: [{ type: 'UPDATE_WILL_EXPORT_TRANSACTIONS', data: { willExportTransactions: false } }],
    assertions: (storeActions, expected) => {
      assert.deepEqual(storeActions, expected, 'Did not produce the expected actions');
    }
  });
  test({
    description: 'should change willExportTransactions to true and trigger a loadAccountHistory action if transactions have not finished loading',
    state: {
      transactions: [{ id: 1, text: 'a transaction' }, { id: 2, text: 'another transaction' }],
      transactionsLoading: true,
      transactionsOldestLoadedBlock: 150,
      loginAccount: { registerBlockNumber: 100 },
    },
    transactionsSelector: {
      selectTransactions: state => state.transactions
    },
    loadAccountHistory: {
      loadAccountHistory: loadAll => ({ type: 'LOAD_ACCOUNT_HISTORY', loadAll })
    },
    expectedOutput: [{ type: 'LOAD_ACCOUNT_HISTORY', loadAll: true }, { type: 'UPDATE_WILL_EXPORT_TRANSACTIONS', data: { willExportTransactions: true } }],
    assertions: (storeActions, expected) => {
      assert.deepEqual(storeActions, expected, 'Did not produce the expected actions');
    }
  });
});
