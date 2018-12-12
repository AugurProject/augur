import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { triggerTransactionsExport } from "modules/transactions/actions/trigger-transactions-export";
import { selectTransactions } from "src/modules/transactions/selectors/transactions";

jest.mock("modules/transactions/selectors/transactions");
jest.mock("modules/auth/actions/load-account-history", () => ({
  loadAccountHistory: () => ({
    type: "LOAD_ACCOUNT_HISTORY"
  })
}));

describe("modules/transactions/actions/trigger-transactions-export.js", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  selectTransactions.mockImplementation(state => state.transactions);

  test("triggered a download if transactionsLoading is false", () => {
    const store = mockStore({
      transactions: [
        { id: 1, text: "a transaction" },
        { id: 2, text: "another transaction" }
      ],
      appStatus: { transactionsLoading: false }
    });

    global.document = {
      createElement: type => {
        expect(type).toBe("a");
        return {
          setAttribute: (type, value) => {
            switch (type) {
              case "href":
                return expect(value).toEqual(
                  "data:text/json;charset=utf-8," +
                    encodeURIComponent(
                      JSON.stringify([
                        { id: 1, text: "a transaction" },
                        { id: 2, text: "another transaction" }
                      ])
                    )
                );
              case "download":
                return expect(value).toEqual("AugurTransactions.json");
              default:
                return expect(true).toBeFalsy();
            }
          },
          click: () => {}
        };
      }
    };
    store.dispatch(triggerTransactionsExport());

    expect(store.getActions()).toHaveLength(0);
  });

  test("dispatched a loadAccountHistory action if transactionsLoading is true", () => {
    const store = mockStore({
      transactions: [
        { id: 1, text: "a transaction" },
        { id: 2, text: "another transaction" }
      ],
      appStatus: { transactionsLoading: true }
    });

    store.dispatch(triggerTransactionsExport());
    const actual = store.getActions();
    const expected = [{ type: "LOAD_ACCOUNT_HISTORY" }];
    expect(store.getActions()).toHaveLength(expected.length);
    expect(actual).toEqual(expected);
  });
});
