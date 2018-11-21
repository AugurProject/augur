import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { loadAccountData } from "modules/auth/actions/load-account-data";
import { augur } from "services/augurjs";

import { updateIsLoggedAndLoadAccountData } from "modules/auth/actions/update-is-logged-and-load-account-data";

jest.mock("services/augurjs");
jest.mock("modules/auth/actions/load-account-data");

describe(`modules/auth/actions/update-is-logged-and-load-account-data.js`, () => {
  let mockStore;
  beforeAll(() => {
    mockStore = configureMockStore([thunk]);
  });

  beforeEach(() => {
    loadAccountData.mockImplementation(account => ({
      type: "LOAD_ACCOUNT_DATA",
      account
    }));
  });

  test("unlocked ethereum node", () => {
    const store = mockStore();
    augur.rpc.clear.mockImplementation(() =>
      store.dispatch({ type: "AUGURJS_RPC_CLEAR" })
    );

    store.dispatch(
      updateIsLoggedAndLoadAccountData("0xb0b", "unlockedEthereumNode")
    );
    const actions = store.getActions();
    expect(actions).toEqual([
      { type: "AUGURJS_RPC_CLEAR" },
      { type: "CLEAR_LOGIN_ACCOUNT" },
      {
        type: "UPDATE_AUTH_STATUS",
        data: {
          statusKey: "isLogged",
          value: true
        }
      },
      {
        type: "LOAD_ACCOUNT_DATA",
        account: {
          address: "0xb0b",
          displayAddress: "0xB0B",
          meta: {
            accountType: "unlockedEthereumNode",
            address: "0xb0b",
            signer: null
          }
        }
      }
    ]);
  });
  test("metamask-connect", () => {
    const store = mockStore();
    augur.rpc.clear.mockImplementation(() =>
      store.dispatch({ type: "AUGURJS_RPC_CLEAR" })
    );

    store.dispatch(updateIsLoggedAndLoadAccountData("0xb0b", "metaMask"));
    const actions = store.getActions();
    expect(actions).toEqual([
      { type: "AUGURJS_RPC_CLEAR" },
      { type: "CLEAR_LOGIN_ACCOUNT" },
      {
        type: "UPDATE_AUTH_STATUS",
        data: {
          statusKey: "isLogged",
          value: true
        }
      },
      {
        type: "LOAD_ACCOUNT_DATA",
        account: {
          address: "0xb0b",
          displayAddress: "0xB0B",
          meta: { accountType: "metaMask", address: "0xb0b", signer: null }
        }
      }
    ]);
  });
});
