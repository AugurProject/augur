import { describe, it } from 'mocha'
import { assert } from 'chai'
import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'

describe(`modules/auth/actions/set-login-account.js`, () => {
  proxyquire.noPreserveCache()
  const mockStore = configureMockStore([thunk])
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)
      const AugurJS = {
        augur: {
          accounts: {
            account: { ...t.state.augur.accounts.account }
          },
          rpc: {
            clear: () => {}
          },
          from: t.state.augur.from
        }
      }
      const UseUnlockedAccount = { useUnlockedAccount: () => {} }
      const action = proxyquire('../../../src/modules/auth/actions/set-login-account.js', {
        '../../../services/augurjs': AugurJS,
        './use-unlocked-account': UseUnlockedAccount
      })
      sinon.stub(UseUnlockedAccount, 'useUnlockedAccount').callsFake(account => ({ type: 'USE_UNLOCKED_ACCOUNT', account }))
      store.dispatch(action.setLoginAccount(t.params.autoLogin, t.params.account))
      t.assertions(store.getActions())
      store.clearActions()
    })
  }
  test({
    description: 'no account available',
    params: {
      autoLogin: false,
      account: '0xtest'
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
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'client-side account in augur.js, no from address',
    params: {
      autoLogin: false,
      account: '0xtest'
    },
    state: {
      augur: {
        accounts: {
          account: {
            address: '0xb0b',
            privateKey: Buffer.from('0x0c33')
          },
          from: null
        }
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'client-side account in augur.js, from address set',
    params: {
      autoLogin: false,
      account: '0xtest'
    },
    state: {
      augur: {
        accounts: {
          account: {
            address: '0xb0b',
            privateKey: Buffer.from('0x0c33')
          },
          from: '0xd00d'
        }
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'unlocked local account',
    params: {
      autoLogin: true,
      account: '0xtest'
    },
    state: {
      augur: {
        accounts: {
          account: {}
        },
        from: '0xd00d'
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'USE_UNLOCKED_ACCOUNT',
        account: '0xtest'
      }])
    }
  })
})
