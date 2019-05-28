import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";
import { augur } from "services/augurjs";
import * as logoutModule from "modules/auth/actions/logout";

jest.mock("services/augurjs");

describe(`modules/auth/actions/logout.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore(testState);
  let clearSpy;

  beforeEach(() => {
    clearSpy = jest.spyOn(augur.rpc, "clear").mockImplementation(() => {});
  });

  afterEach(() => {
    clearSpy.mockReset();
  });

  test(`Logout the logged in account`, () => {
    const expectedOutput = [
      {
        type: "CLEAR_TRANSACTION_DATA"
      },
      {
        type: "CLEAR_LOGIN_ACCOUNT"
      }
    ];
    store.dispatch(logoutModule.logout());
    expect(store.getActions()).toEqual(expectedOutput);
  });
});
