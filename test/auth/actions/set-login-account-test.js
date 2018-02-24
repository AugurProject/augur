import { describe, it } from 'mocha'
import { assert } from 'chai'
import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'

describe(`modules/auth/actions/set-login-account.js`, () => {
  proxyquire.noPreserveCache()
  const mockStore = configureMockStore([thunk])
  const test = t => it(t.description, () => {
    const store = mockStore()
    const UseUnlockedAccount = { useUnlockedAccount: () => {} }
    const action = proxyquire('../../../src/modules/auth/actions/set-login-account.js', {
      './use-unlocked-account': UseUnlockedAccount
    })
    sinon.stub(UseUnlockedAccount, 'useUnlockedAccount').callsFake(unlockedAccount => ({ type: 'USE_UNLOCKED_ACCOUNT', unlockedAccount }))
    store.dispatch(action.setLoginAccount(t.params.autoLogin, t.params.account))
    t.assertions(store.getActions())
    store.clearActions()
  })
  test({
    description: 'do not auto-login',
    params: {
      autoLogin: false,
      account: '0xtest'
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'auto-login',
    params: {
      autoLogin: true,
      account: '0xtest'
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{ type: 'USE_UNLOCKED_ACCOUNT', unlockedAccount: '0xtest' }])
    }
  })
})
