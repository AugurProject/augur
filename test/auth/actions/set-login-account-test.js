import { describe, it } from 'mocha';
import { assert } from 'chai';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import thunk from 'redux-thunk';

describe(`modules/auth/actions/set-login-account.js`, () => {
  proxyquire.noPreserveCache();
  const mockStore = configureMockStore([thunk]);
  describe('setLoginAccount', () => {
    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state);
        const AugurJS = {
          augur: {
            accounts: {
              account: { ...t.state.augur.accounts.account },
              logout: () => {}
            },
            from: t.state.augur.from
          }
        };
        const LoadAccountData = { loadFullAccountData: () => {} };
        const UseUnlockedAccount = { useUnlockedAccount: () => {} };
        const action = proxyquire('../../../src/modules/auth/actions/set-login-account.js', {
          '../../../services/augurjs': AugurJS,
          '../../auth/actions/load-account-data': LoadAccountData,
          '../../auth/actions/use-unlocked-account': UseUnlockedAccount
        });
        sinon.stub(LoadAccountData, 'loadFullAccountData', account => (dispatch) => {
          dispatch({ type: 'LOAD_FULL_ACCOUNT_DATA', account });
        });
        sinon.stub(UseUnlockedAccount, 'useUnlockedAccount', unlockedAddress => (dispatch) => {
          dispatch({ type: 'USE_UNLOCKED_ACCOUNT', unlockedAddress });
        });
        store.dispatch(action.setLoginAccount(t.params.autoLogin));
        t.assertions(store.getActions());
        store.clearActions();
      });
    };
    test({
      description: 'no account available',
      params: {
        autoLogin: false
      },
      state: {
        augur: {
          accounts: {
            account: {}
          },
          from: null
        }
      },
      assertions: (actions) => {
        assert.deepEqual(actions, []);
      }
    });
    test({
      description: 'client-side account in augur.js, no from address',
      params: {
        autoLogin: false
      },
      state: {
        augur: {
          accounts: {
            account: {
              address: '0xb0b',
              privateKey: new Buffer('0x0c33')
            },
            from: null
          }
        }
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'LOAD_FULL_ACCOUNT_DATA',
          account: { address: '0xb0b' }
        }]);
      }
    });
    test({
      description: 'client-side account in augur.js, from address set',
      params: {
        autoLogin: false
      },
      state: {
        augur: {
          accounts: {
            account: {
              address: '0xb0b',
              privateKey: new Buffer('0x0c33')
            },
            from: '0xd00d'
          }
        }
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'LOAD_FULL_ACCOUNT_DATA',
          account: { address: '0xb0b' }
        }]);
      }
    });
    test({
      description: 'unlocked local account',
      params: {
        autoLogin: true
      },
      state: {
        augur: {
          accounts: {
            account: {}
          },
          from: '0xd00d'
        },
      },
      assertions: (actions) => {
        assert.deepEqual(actions, [{
          type: 'USE_UNLOCKED_ACCOUNT',
          unlockedAddress: '0xd00d'
        }]);
      }
    });
  });
});
