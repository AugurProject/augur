import { describe, it } from 'mocha'
import { assert } from 'chai'
import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'

describe(`modules/auth/actions/use-unlocked-account.js`, () => {
  proxyquire.noPreserveCache()
  const mockStore = configureMockStore([thunk])
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)
      const AugurJS = {
        augur: {
          accounts: { logout: () => {} },
          rpc: { isUnlocked: () => {} }
        }
      }
      const LoadAccountData = { loadAccountData: () => {} }
      const action = proxyquire('../../../src/modules/auth/actions/use-unlocked-account.js', {
        '../../../services/augurjs': AugurJS,
        './load-account-data': LoadAccountData
      })
      sinon.stub(AugurJS.augur.rpc, 'isUnlocked', (address, callback) => {
        callback(t.state.isUnlocked)
      })
      sinon.stub(LoadAccountData, 'loadAccountData', account => (dispatch) => {
        dispatch({ type: 'LOAD_FULL_ACCOUNT_DATA', account })
      })
      store.dispatch(action.useUnlockedAccount(t.params.unlockedAddress))
      t.assertions(store.getActions())
      store.clearActions()
    })
  }
  test({
    description: 'no address',
    params: {
      unlockedAddress: undefined
    },
    state: {
      isUnlocked: undefined
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'locked address',
    params: {
      unlockedAddress: '0xb0b'
    },
    state: {
      isUnlocked: false
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'unlocked address',
    params: {
      unlockedAddress: '0xb0b'
    },
    state: {
      isUnlocked: true
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [
        {
          type: 'UPDATE_IS_LOGGED',
          data: {
            isLogged: true
          }
        },
        {
          type: 'LOAD_FULL_ACCOUNT_DATA',
          account: {
            address: '0xb0b',
            isUnlocked: true
          }
        }
      ])
    }
  })
  test({
    description: 'rpc.unlocked error',
    params: {
      unlockedAddress: '0xb0b'
    },
    state: {
      isUnlocked: {
        error: 123,
        message: 'panic!'
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
})
