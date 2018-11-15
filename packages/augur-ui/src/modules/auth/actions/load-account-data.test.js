import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as loadAccountDataFromLocalStorageModule from "modules/auth/actions/load-account-data-from-local-storage";
import * as loadAccountDataModule from "modules/auth/actions/load-account-data";
import * as updateAssetsModule from "modules/auth/actions/update-assets";
import * as clearOrphanedOrderDataModule from "modules/orders/actions/orphaned-orders";
import * as updateLoginAccountModule from "modules/auth/actions/update-login-account";
import * as loadAccountTradesModule from "modules/positions/actions/load-account-trades";
import * as approveAccountModule from "modules/auth/actions/approve-account";

jest.mock("./load-account-data-from-local-storage");
jest.mock("./update-assets");
jest.mock("../../orders/actions/orphaned-orders");
jest.mock("./update-login-account");
jest.mock("../../positions/actions/load-account-trades");
jest.mock("./approve-account");

describe(`modules/auth/actions/load-account-data.js`, () => {
  const mockStore = configureMockStore([thunk]);

  const t1 = {
    description: "no account",
    params: {
      account: null
    },
    assertions: actions => {
      expect(actions).toEqual([]);
    }
  };

  const t2 = {
    description: "account without address",
    params: {
      account: { name: "jack" }
    },
    assertions: actions => {
      expect(actions).toEqual([]);
    }
  };

  const t3 = {
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
  };

  const t4 = {
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
  };

  describe.each([t1, t2, t3, t4])("Load account data tests", t => {
    const store = mockStore(t.state);

    beforeEach(() => {
      jest
        .spyOn(loadAccountDataFromLocalStorageModule, "loadAccountDataFromLocalStorage")
        .mockImplementation(() => ({
          type: "LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE"
        }));
      jest
        .spyOn(updateAssetsModule, "updateAssets")
        .mockImplementation(() => ({ type: "UPDATE_ASSETS" }));
      jest
        .spyOn(clearOrphanedOrderDataModule, "clearOrphanedOrderData")
        .mockImplementation(() => ({ type: "CLEAR_ORPHANED_ORDER_DATA" }));
      jest
        .spyOn(updateLoginAccountModule, "updateLoginAccount")
        .mockImplementation(data => ({ type: "UPDATE_LOGIN_ACCOUNT", data }));
      jest
        .spyOn(loadAccountTradesModule, "loadAccountTrades")
        .mockImplementation(() => ({ type: "UPDATE_ACCOUNT_TRADES_DATA" }));
      jest
        .spyOn(approveAccountModule, "checkAccountAllowance")
        .mockImplementation(() => ({ type: "CHECK_ACCOUNT_ALLOWANCE" }));
    });

    afterEach(() => {
      store.clearActions();
    });

    test(t.description, () => {
      store.dispatch(loadAccountDataModule.loadAccountData(t.params.account));
      t.assertions(store.getActions());
    });
  });
});
