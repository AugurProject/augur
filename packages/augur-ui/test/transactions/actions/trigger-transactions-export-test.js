import proxyquire from "proxyquire";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  triggerTransactionsExport,
  __RewireAPI__ as RewireReExport
} from "modules/transactions/actions/trigger-transactions-export";

describe(`modules/transactions/actions/trigger-transactions-export.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const doc = global.document;

  const test = t => {
    it(t.description, () => {
      const store = mockStore(t.state);
      RewireReExport.__Rewire__("selectTransactions", t.selectTransactions);
      RewireReExport.__Rewire__("loadAccountHistory", t.loadAccountHistory);

      global.document = t.document;

      store.dispatch(triggerTransactionsExport());
      t.assertions(store.getActions(), t.expectedOutput);

      global.document = doc;

      RewireReExport.__ResetDependency__("selectTransactions");
      RewireReExport.__ResetDependency__("loadAccountHistory");
    });
  };
  test({
    description: "should trigger a download if transactionsLoading is false",
    state: {
      transactions: [
        { id: 1, text: "a transaction" },
        { id: 2, text: "another transaction" }
      ],
      appStatus: { transactionsLoading: false }
    },
    selectTransactions: state => state.transactions,
    loadAccountHistory: (loadAll, cb) => ({
      type: "LOAD_ACCOUNT_HISTORY",
      loadAll
    }),
    document: {
      createElement: type => {
        assert.equal(type, "a");
        return {
          setAttribute: (type, value) => {
            switch (type) {
              case "href":
                return assert.deepEqual(
                  value,
                  "data:text/json;charset=utf-8," +
                    encodeURIComponent(
                      JSON.stringify([
                        { id: 1, text: "a transaction" },
                        { id: 2, text: "another transaction" }
                      ])
                    )
                );
              case "download":
                return assert.deepEqual(value, "AugurTransactions.json");
              default:
                return assert.isFalse(
                  true,
                  "call to setAttribute with unexpected values"
                );
            }
          },
          click: () => {}
        };
      }
    },
    expectedOutput: [],
    assertions: (storeActions, expected) => {
      assert.deepEqual(
        storeActions,
        expected,
        "Did not produce the expected actions"
      );
    }
  });
  test({
    description:
      "should dispatch a loadAccountHistory action if transactionsLoading is true",
    state: {
      transactions: [
        { id: 1, text: "a transaction" },
        { id: 2, text: "another transaction" }
      ],
      appStatus: { transactionsLoading: true }
    },
    transactionsSelector: {
      selectTransactions: state => state.transactions
    },
    loadAccountHistory: (loadAll, cb) => {
      assert.isTrue(
        loadAll,
        "loadAll passed to loadAccountHistory should be true"
      );
      assert.isFunction(
        cb,
        "cb passed to loadAccountHistory should be a function"
      );
      return { type: "LOAD_ACCOUNT_HISTORY", loadAll };
    },
    expectedOutput: [{ type: "LOAD_ACCOUNT_HISTORY", loadAll: true }],
    assertions: (storeActions, expected) => {
      assert.deepEqual(
        storeActions,
        expected,
        "Did not produce the expected actions"
      );
    }
  });
});
