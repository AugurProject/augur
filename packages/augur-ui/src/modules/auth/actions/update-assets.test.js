import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import speedomatic from "speedomatic";
import { updateAssets } from "modules/auth/actions/update-assets";
import * as updateLoginAccountModule from "modules/auth/actions/update-login-account";
import { augur } from "services/augurjs";
import * as updateEtherBalanceModule from "modules/auth/actions/update-ether-balance";

const ETH = "eth";
const REP = "rep";

describe("modules/auth/actions/update-assets.js", () => {
  const mockStore = configureMockStore([thunk]);
  let updateLoginAccountSpy;
  let ethGetBalanceSpy;
  let reputationTokenSpy;
  let balanceOfSpy;

  afterAll(() => {
    updateLoginAccountSpy.mockReset();
    ethGetBalanceSpy.mockReset();
    reputationTokenSpy.mockReset();
    balanceOfSpy.mockReset();
  });

  const t1 = {
    description: `should dispatch 'updateLoginAccount' if a user is unlogged`,
    state: {
      loginAccount: {},
      universe: {
        id: "blah"
      }
    },
    assertions: (store, done) => {
      store.dispatch(updateAssets());
      expect(updateLoginAccountSpy).toHaveBeenCalledTimes(1);
      done();
    }
  };

  describe.each([t1])("update assets tests", t => {
    const store = mockStore(t.state || {});

    beforeEach(() => {
      updateLoginAccountSpy = jest
        .spyOn(updateLoginAccountModule, "updateLoginAccount")
        .mockImplementation(() => ({
          type: "updateLoginAccount"
        }));
    });

    test(t.description, done => {
      t.assertions(store, done);
    });
  });

  const t2 = {
    asset: ETH,
    description: `should call the callback with the expected error`,
    state: {
      loginAccount: {
        address: "0xtest"
      },
      universe: {
        id: "0xuniverse"
      },
      address: "0xtest"
    },
    assertions: (store, asset, done) => {
      const ERR = {
        error: `${asset}-failure`
      };
      ethGetBalanceSpy = jest
        .spyOn(augur.rpc.eth, "getBalance")
        .mockImplementation((value, callback) => {
          callback(ERR, "1000");
        });

      reputationTokenSpy = jest
        .spyOn(augur.api.Universe, "getReputationToken")
        .mockImplementation((value, callback) => {
          callback(ERR, "10000");
        });

      balanceOfSpy = jest
        .spyOn(augur.api.ReputationToken, "balanceOf")
        .mockImplementation((value, callback) => {
          callback(ERR, "10000");
        });
      jest
        .spyOn(updateEtherBalanceModule, "updateEtherBalance")
        .mockImplementation(() => ({
          type: "UPDATE_ASSETS"
        }));
      store.dispatch(updateAssets(err => expect(err).toEqual(ERR)));
      done();
    }
  };

  const t3 = {
    asset: ETH,
    description: `should dispatch 'updateLoginAccount' if value is present but doesn't equal updated value`,
    state: {
      loginAccount: {
        eth: 11,
        rep: 11
      },
      universe: {
        id: "myId"
      }
    },
    assertions: (store, asset, done) => {
      jest.doMock("services/augurjs", () => {});
      store.dispatch(updateAssets());
      expect(updateLoginAccountSpy).toHaveBeenCalledTimes(2);
      done();
    }
  };

  const t4 = {
    asset: ETH,
    description: `should call the callback with the balances once all have loaded`,
    state: {
      loginAccount: {
        address: "0xtest",
        ethTokens: "10",
        eth: "10",
        rep: "10"
      },
      universe: {
        id: "0xuniverse"
      }
    },
    assertions: (store, asset, done) => {
      jest.spyOn(speedomatic, "unfix").mockImplementation(value => value);
      const testValue = {
        eth: 10,
        rep: 20
      };
      ethGetBalanceSpy.mockImplementation((value, callback) => {
        callback(null, testValue.eth);
      });

      reputationTokenSpy.mockImplementation((value, callback) => {
        callback(null, "0xtestx0");
      });
      balanceOfSpy.mockImplementation((value, callback) => {
        callback(null, testValue.rep);
      });
      store.dispatch(
        updateAssets((err, balances) => {
          expect(err).toBeNull();
          expect(balances).toEqual(testValue);
        })
      );
      done();
    }
  };

  describe.each([t2, t3, t4])("loadAssets callbacks", t => {
    const callbackTests = asset => {
      t.asset = asset;

      beforeEach(() => {
        updateLoginAccountSpy = jest
          .spyOn(updateLoginAccountModule, "updateLoginAccount")
          .mockImplementation(() => ({
            type: "updateLoginAccount"
          }));
      });

      afterEach(() => {
        ethGetBalanceSpy.mockReset();
        reputationTokenSpy.mockReset();
        balanceOfSpy.mockReset();
        updateLoginAccountSpy.mockReset();
      });

      describe(`${asset}`, () => {
        test("should dispatch 'updateLoginAccount' if value is not present", done => {
          const store = mockStore({
            loginAccount: {},
            universe: {
              id: "myId"
            }
          });
          store.dispatch(updateAssets());
          expect(updateLoginAccountSpy).toHaveBeenCalledTimes(1);
          t.assertions(store, asset, done);
          done();
        });
      });
    };
    callbackTests(ETH);
    callbackTests(REP);
  });
});
