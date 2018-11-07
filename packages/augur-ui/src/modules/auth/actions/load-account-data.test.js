import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { loadAccountDataFromLocalStorage } from "modules/auth/actions/load-account-data-from-local-storage";
import { updateAssets } from "modules/auth/actions/update-assets";
import { clearOrphanedOrderData } from "modules/orders/actions/orphaned-orders";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import { checkAccountAllowance } from "modules/auth/actions/approve-account";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import { augur } from "src/services/augurjs";
import { loadReportingWindowBounds } from "modules/reports/actions/load-reporting-window-bounds";

const { ACCOUNT_TYPES } = augur.rpc.constants;

jest.mock("modules/auth/actions/load-account-data-from-local-storage");
jest.mock("modules/auth/actions/update-assets");
jest.mock("modules/orders/actions/orphaned-orders");
jest.mock("modules/auth/actions/update-login-account");
jest.mock("modules/positions/actions/load-account-trades");
jest.mock("modules/auth/actions/approve-account");
jest.mock("modules/reports/actions/load-reporting-window-bounds");

describe(`modules/auth/actions/load-account-data.js`, () => {
  const mockStore = configureMockStore([thunk]);

  beforeEach(() => {
    loadAccountDataFromLocalStorage.mockImplementation(() => ({
      type: "LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE"
    }));

    updateAssets.mockImplementation(() => ({ type: "UPDATE_ASSETS" }));

    clearOrphanedOrderData.mockImplementation(() => ({
      type: "CLEAR_ORPHANED_ORDER_DATA"
    }));

    updateLoginAccount.mockImplementation(data => ({
      type: "UPDATE_LOGIN_ACCOUNT",
      data
    }));

    loadAccountTrades.mockImplementation(data => ({
      type: "UPDATE_ACCOUNT_TRADES_DATA"
    }));

    checkAccountAllowance.mockImplementation(data => ({
      type: "CHECK_ACCOUNT_ALLOWANCE"
    }));

    loadReportingWindowBounds.mockImplementation(() => () => {});
  });

  test("no account", () => {
    const store = mockStore();

    store.dispatch(loadAccountData(null));
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
  test("account without address", () => {
    const store = mockStore();

    store.dispatch(loadAccountData({ name: "jack" }));
    expect(store.getActions()).toEqual([]);
  });
  test("account address", () => {
    const store = mockStore({
      loginAccount: {
        address: "0xb0b",
        meta: { accountType: ACCOUNT_TYPES.META_MASK }
      },
      universe: {
        id: "0xdeadbeef"
      }
    });

    store.dispatch(
      loadAccountData({
        address: "0xb0b",
        meta: { accountType: ACCOUNT_TYPES.META_MASK }
      })
    );
    expect(store.getActions()).toEqual([
      { type: "LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE" },
      { type: "CLEAR_ORPHANED_ORDER_DATA" },
      {
        type: "UPDATE_LOGIN_ACCOUNT",
        data: {
          address: "0xb0b",
          meta: { accountType: ACCOUNT_TYPES.META_MASK }
        }
      },
      { type: "UPDATE_ACCOUNT_TRADES_DATA" },
      { type: "CHECK_ACCOUNT_ALLOWANCE" },
      { type: "UPDATE_ASSETS" }
    ]);
  });
  test("account with address, loginId, name, isUnlocked, edgeAccount", () => {
    const store = mockStore({
      loginAccount: {
        address: "0xb0b"
      },
      universe: {
        id: "0xdeadbeef"
      }
    });

    store.dispatch(
      loadAccountData({
        address: "0xb0b",
        name: "jack",
        isUnlocked: true,
        edgeAccount: { username: "jack" }
      })
    );
    const actions = store.getActions();
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
  });
});
