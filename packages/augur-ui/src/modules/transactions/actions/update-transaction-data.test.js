import { updateTransactionsData } from "modules/transactions/actions/update-transactions-data";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";

describe(`modules/transactions/actions/update-transactions-data.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);
  test("fired update and processes transaction actions", () => {
    store.dispatch(
      updateTransactionsData({
        test: "testTransactionData"
      })
    );
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_TRANSACTIONS_DATA",
        data: {
          updatedTransactionsData: {
            test: "testTransactionData"
          }
        }
      }
    ]);
  });
});
