import configureMockStore from "redux-mock-store";
import sinon from "sinon";
import thunk from "redux-thunk";

jest.mock(
  "./load-account-data-from-local-storage",
  () => LoadAccountDataFromLocalStorage
);

jest.mock("./update-assets", () => UpdateAssets);
jest.mock("../../orders/actions/orphaned-orders", () => ClearOrphanedOrderData);
jest.mock("./update-login-account", () => UpdateLoginAccount);
jest.mock(
  "../../positions/actions/load-account-trades",
  () => LoadAccountTrades
);
jest.mock("./approve-account", () => approveAccount);

describe(`modules/auth/actions/load-account-data.js`, () => {
  const mockStore = configureMockStore([thunk]);
  const test = t => {
    test(t.description, () => {
      const store = mockStore(t.state);
      const LoadAccountDataFromLocalStorage = {};
      const UpdateAssets = { updateAssets: () => {} };
      const ClearOrphanedOrderData = { clearOrphanedOrderData: () => {} };
      const LoadAccountTrades = { loadAccountTrades: () => {} };
      const UpdateLoginAccount = { updateLoginAccount: () => {} };
      const approveAccount = { checkAccountAllowance: () => {} };

      const action = require("../../../src/modules/auth/actions/load-account-data.js");
      LoadAccountDataFromLocalStorage.loadAccountDataFromLocalStorage = sinon
        .stub()
        .returns({ type: "LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE" });
      sinon
        .stub(UpdateAssets, "updateAssets")
        .callsFake(() => ({ type: "UPDATE_ASSETS" }));
      sinon
        .stub(ClearOrphanedOrderData, "clearOrphanedOrderData")
        .callsFake(() => ({ type: "CLEAR_ORPHANED_ORDER_DATA" }));
      sinon
        .stub(UpdateLoginAccount, "updateLoginAccount")
        .callsFake(data => ({ type: "UPDATE_LOGIN_ACCOUNT", data }));
      sinon
        .stub(LoadAccountTrades, "loadAccountTrades")
        .callsFake(data => ({ type: "UPDATE_ACCOUNT_TRADES_DATA" }));
      sinon
        .stub(approveAccount, "checkAccountAllowance")
        .callsFake(data => ({ type: "CHECK_ACCOUNT_ALLOWANCE" }));
      store.dispatch(action.loadAccountData(t.params.account));
      t.assertions(store.getActions());
      store.clearActions();
    });
  };
  test({
    description: "no account",
    params: {
      account: null
    },
    assertions: actions => {
      expect(actions).toEqual([]);
    }
  });
  test({
    description: "account without address",
    params: {
      account: { name: "jack" }
    },
    assertions: actions => {
      expect(actions).toEqual([]);
    }
  });
  test({
    description: "account address",
    params: {
      account: {
        address: "0xb0b"
      }
    },
    state: {
      loginAccount: {
        address: "0xb0b"
      },
      universe: {
        id: "0xdeadbeef"
      }
    },
    assertions: actions => {
      expect(actions).toEqual([
        { type: "LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE" },
        { type: "CLEAR_ORPHANED_ORDER_DATA" },
        { type: "UPDATE_LOGIN_ACCOUNT", data: { address: "0xb0b" } },
        { type: "UPDATE_ACCOUNT_TRADES_DATA" },
        { type: "CHECK_ACCOUNT_ALLOWANCE" },
        { type: "UPDATE_ASSETS" }
      ]);
    }
  });
  test({
    description: "account with address, loginId, name, isUnlocked, edgeAccount",
    params: {
      account: {
        address: "0xb0b",
        name: "jack",
        isUnlocked: true,
        edgeAccount: { username: "jack" }
      }
    },
    state: {
      loginAccount: {
        address: "0xb0b"
      },
      universe: {
        id: "0xdeadbeef"
      }
    },
    assertions: actions => {
      expect(actions).toEqual([
        { type: "LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE" },
        { type: "CLEAR_ORPHANED_ORDER_DATA" },
        {
          type: "UPDATE_LOGIN_ACCOUNT",
          data: {
            address: "0xb0b",
            name: "jack",
            isUnlocked: true,
            edgeAccount: { username: "jack" }
          }
        },
        { type: "UPDATE_ACCOUNT_TRADES_DATA" },
        { type: "CHECK_ACCOUNT_ALLOWANCE" },
        { type: "UPDATE_ASSETS" }
      ]);
    }
  });
});
