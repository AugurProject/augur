import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as updateLoginAccountModule from "modules/auth/actions/update-login-account";
import * as updateContractApiModule from "modules/contracts/actions/update-contract-api";

describe(`modules/auth/actions/update-login-account.js`, () => {
  const mockStore = configureMockStore([thunk]);

  const t1 = {
    description: "should fire a UPDATE_LOGIN_ACCOUNT action type with data",
    state: {},
    method: "updateLoginAccount",
    param: { address: "0xb0b" },
    assertions: actions => {
      const output = [
        {
          type: "UPDATE_LOGIN_ACCOUNT",
          data: {
            loginAccount: { address: "0xb0b" }
          }
        },
        {
          type: "UPDATE_FROM_ADDRESS",
          address: "0xb0b"
        }
      ];
      expect(actions).toEqual(output);
    }
  };

  const t2 = {
    description: "should fire a CLEAR_LOGIN_ACCOUNT action type",
    state: {},
    method: "clearLoginAccount",
    param: { address: "0xb0b" },
    assertions: actions => {
      const output = [
        {
          type: "CLEAR_LOGIN_ACCOUNT"
        }
      ];
      expect(actions).toEqual(output);
    }
  };

  describe.each([t1, t2])("", t => {
    const store = mockStore(t.state);

    beforeEach(() => {
      jest
        .spyOn(updateContractApiModule, "updateFromAddress")
        .mockImplementation(address => ({
          type: "UPDATE_FROM_ADDRESS",
          address
        }));
    });

    afterEach(() => {
      store.clearActions();
    });

    test(t.description, () => {
      store.dispatch(updateLoginAccountModule[t.method](t.param));
      t.assertions(store.getActions());
    });
  });
});
