import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as useUnlockedAccountModule from "modules/auth/actions/use-unlocked-account";
import * as updateIsLoggedAndLoadAccountDataModule from "modules/auth/actions/update-is-logged-and-load-account-data";
import * as isGlobalWeb3Module from "modules/auth/helpers/is-global-web3";
import { augur } from "services/augurjs";

const MOCK_ERROR = { error: 42, message: "fail!" };

describe(`modules/auth/actions/update-login-account.js`, () => {
  const mockStore = configureMockStore([thunk]);

  const t1 = {
    description: "no address",
    params: {
      unlockedAddress: undefined
    },
    stub: {
      augur: {
        rpc: { isUnlocked: (address, callback) => callback(null, null) }
      },
      isGlobalWeb3: () => assert.fail()
    },
    assertions: (err, actions) => {
      expect(err).toStrictEqual("no account address");
      expect(actions).toHaveLength(0);
    }
  };

  const t2 = {
    description: "isUnlocked error",
    params: {
      unlockedAddress: "0xb0b"
    },
    stub: {
      augur: {
        rpc: { isUnlocked: (address, callback) => callback(MOCK_ERROR) }
      },
      isGlobalWeb3: () => false
    },
    assertions: (err, actions) => {
      expect(err).toEqual(MOCK_ERROR);
      expect(actions).toEqual([
        {
          type: "IS_GLOBAL_WEB3",
          data: { isGlobalWeb3: false }
        },
        {
          type: "AUGURJS_RPC_IS_UNLOCKED",
          data: { isUnlocked: MOCK_ERROR }
        }
      ]);
    }
  };

  const t3 = {
    description: "locked address",
    params: {
      unlockedAddress: "0xb0b"
    },
    stub: {
      augur: {
        rpc: { isUnlocked: (address, callback) => callback(null, false) }
      },
      isGlobalWeb3: () => false
    },
    assertions: (err, actions) => {
      expect(err).toBeNull();
      expect(actions).toEqual([
        {
          type: "IS_GLOBAL_WEB3",
          data: { isGlobalWeb3: false }
        },
        {
          type: "AUGURJS_RPC_IS_UNLOCKED",
          data: { isUnlocked: false }
        }
      ]);
    }
  };

  const t4 = {
    description: "using metamask-connect",
    params: {
      unlockedAddress: "0xb0b"
    },
    stub: {
      augur: { rpc: { isUnlocked: () => assert.fail() } },
      isGlobalWeb3: () => true
    },
    assertions: (err, actions) => {
      expect(err).toBeNull();
      expect(actions).toEqual([
        {
          type: "IS_GLOBAL_WEB3",
          data: { isGlobalWeb3: true }
        },
        {
          type: "UPDATE_IS_LOGGED_AND_LOAD_ACCOUNT_DATA",
          data: {
            unlockedAccount: "0xb0b",
            accountType: "metaMask"
          }
        }
      ]);
    }
  };

  const t5 = {
    description: "unlocked local account",
    params: {
      unlockedAddress: "0xb0b"
    },
    stub: {
      augur: {
        rpc: { isUnlocked: (address, callback) => callback(null, true) }
      },
      isGlobalWeb3: () => false
    },
    assertions: (err, actions) => {
      expect(actions).toEqual([
        {
          type: "IS_GLOBAL_WEB3",
          data: { isGlobalWeb3: false }
        },
        {
          type: "AUGURJS_RPC_IS_UNLOCKED",
          data: { isUnlocked: true }
        },
        {
          type: "UPDATE_IS_LOGGED_AND_LOAD_ACCOUNT_DATA",
          data: {
            unlockedAccount: "0xb0b",
            accountType: "unlockedEthereumNode"
          }
        }
      ]);
    }
  };

  describe.each([t1, t2, t3, t4, t5])("Use unlocked account tests", t => {
    const store = mockStore(t.state);

    beforeEach(() => {
      jest
        .spyOn(
          updateIsLoggedAndLoadAccountDataModule,
          "updateIsLoggedAndLoadAccountData"
        )
        .mockImplementation((unlockedAccount, accountType) => ({
          type: "UPDATE_IS_LOGGED_AND_LOAD_ACCOUNT_DATA",
          data: { unlockedAccount, accountType }
        }));
      jest.spyOn(isGlobalWeb3Module, "default").mockImplementation(() => {
        const isGlobalWeb3 = t.stub.isGlobalWeb3();
        store.dispatch({ type: "IS_GLOBAL_WEB3", data: { isGlobalWeb3 } });
        return isGlobalWeb3;
      });
      jest
        .spyOn(augur.rpc, "isUnlocked")
        .mockImplementation((address, callback) => {
          t.stub.augur.rpc.isUnlocked(address, (err, isUnlocked) => {
            store.dispatch({
              type: "AUGURJS_RPC_IS_UNLOCKED",
              data: { isUnlocked: err || isUnlocked }
            });
            if (err) return callback(err);
            callback(null, isUnlocked);
          });
        });
    });

    test(t.description, done => {
      store.dispatch(
        useUnlockedAccountModule.useUnlockedAccount(
          t.params.unlockedAddress,
          err => {
            t.assertions(err, store.getActions());
            store.clearActions();
            done();
          }
        )
      );
      done();
    });
  });
});
