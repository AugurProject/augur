import configureMockStore from "redux-mock-store";
import proxyquire from "proxyquire";
import sinon from "sinon";
import thunk from "redux-thunk";
import { augur } from "services/augurjs";

const { ACCOUNT_TYPES } = augur.rpc.constants;

describe(`modules/auth/actions/load-account-data.js`, () => {
  proxyquire.noPreserveCache();
  const mockStore = configureMockStore([thunk]);
  const test = t => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const LoadAccountDataFromLocalStorage = {};
      const UpdateAssets = { updateAssets: () => {} };
      const ClearOrphanedOrderData = { clearOrphanedOrderData: () => {} };
      const LoadAccountHistory = { loadAccountHistory: () => {} };
      const UpdateLoginAccount = { updateLoginAccount: () => {} };
      const approveAccount = { checkAccountAllowance: () => {} };
      const windowRef = { windowRef: { localStorage: { setItem: () => {} } } };

      const action = proxyquire(
        "../../../src/modules/auth/actions/load-account-data.js",
        {
          "../../../utils/window-ref": windowRef,
          "./load-account-data-from-local-storage": LoadAccountDataFromLocalStorage,
          "./update-assets": UpdateAssets,
          "../../orders/actions/orphaned-orders": ClearOrphanedOrderData,
          "./update-login-account": UpdateLoginAccount,
          "./load-account-history": LoadAccountHistory,
          "./approve-account": approveAccount
        }
      );
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
        .stub(LoadAccountHistory, "loadAccountHistory")
        .callsFake(() => ({ type: "LOAD_ACCOUNT_HISTORY" }));
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
      account: null,
      meta: {},
    },
    assertions: actions => {
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: "account without address",
    params: {
      account: { name: "jack" },
      meta: { accountType: ACCOUNT_TYPES.META_MASK }
    },
    assertions: actions => {
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: "account address",
    params: {
      account: {
        address: "0xb0b",
        meta: { accountType: ACCOUNT_TYPES.META_MASK }
      }
    },
    state: {
      loginAccount: {
        address: "0xb0b",
        meta: { accountType: ACCOUNT_TYPES.META_MASK }
      },
      universe: {
        id: "0xdeadbeef"
      }
    },
    assertions: actions => {
      assert.deepEqual(actions, [
        { type: "LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE" },
        { type: "UPDATE_LOGIN_ACCOUNT", data: { address: "0xb0b", meta: { accountType: ACCOUNT_TYPES.META_MASK } } },
        { type: "CLEAR_ORPHANED_ORDER_DATA" },
        { type: "LOAD_ACCOUNT_HISTORY" },
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
        edgeAccount: { username: "jack" },
        meta: { accountType: "" }
      }
    },
    state: {
      loginAccount: {
        address: "0xb0b",
        meta: { accountType: ACCOUNT_TYPES.META_MASK }
      },
      universe: {
        id: "0xdeadbeef"
      }
    },
    assertions: actions => {
      assert.deepEqual(actions, [
        { type: "LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE" },
        {
          type: "UPDATE_LOGIN_ACCOUNT",
          data: {
            address: "0xb0b",
            name: "jack",
            isUnlocked: true,
            edgeAccount: { username: "jack" },
            meta: { accountType: "" }
          }
        },
        { type: "CLEAR_ORPHANED_ORDER_DATA" },
        { type: "LOAD_ACCOUNT_HISTORY" },
        { type: "CHECK_ACCOUNT_ALLOWANCE" },
        { type: "UPDATE_ASSETS" }
      ]);
    }
  });
});
