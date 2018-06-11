

import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'

describe(`modules/auth/actions/load-account-data.js`, () => {
  proxyquire.noPreserveCache()
  const mockStore = configureMockStore([thunk])
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)
      const LoadAccountDataFromLocalStorage = {}
      const UpdateAssets = { updateAssets: () => {} }
      const LoadAccountTrades = { loadAccountTrades: () => {} }
      const UpdateLoginAccount = { updateLoginAccount: () => {} }
      const approveAccount = { checkAccountAllowance: () => {} }
      const action = proxyquire('../../../src/modules/auth/actions/load-account-data.js', {
        './load-account-data-from-local-storage': LoadAccountDataFromLocalStorage,
        './update-assets': UpdateAssets,
        './update-login-account': UpdateLoginAccount,
        '../../my-positions/actions/load-account-trades': LoadAccountTrades,
        './approve-account': approveAccount,
      })
      LoadAccountDataFromLocalStorage.loadAccountDataFromLocalStorage = sinon.stub().returns({ type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE' })
      sinon.stub(UpdateAssets, 'updateAssets').callsFake(() => ({ type: 'UPDATE_ASSETS' }))
      sinon.stub(UpdateLoginAccount, 'updateLoginAccount').callsFake(data => ({ type: 'UPDATE_LOGIN_ACCOUNT', data }))
      sinon.stub(LoadAccountTrades, 'loadAccountTrades').callsFake(data => ({ type: 'UPDATE_ACCOUNT_TRADES_DATA' }))
      sinon.stub(approveAccount, 'checkAccountAllowance').callsFake(data => ({ type: 'CHECK_ACCOUNT_ALLOWANCE' }))
      store.dispatch(action.loadAccountData(t.params.account))
      t.assertions(store.getActions())
      store.clearActions()
    })
  }
  test({
    description: 'no account',
    params: {
      account: null,
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'account without address',
    params: {
      account: { name: 'jack' },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'account address',
    params: {
      account: {
        address: '0xb0b',
      },
    },
    state: {
      loginAccount: {
        address: '0xb0b',
      },
      universe: {
        id: '0xdeadbeef',
      },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [
        { type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE' },
        { type: 'UPDATE_LOGIN_ACCOUNT', data: { address: '0xb0b' } },
        { type: 'UPDATE_ACCOUNT_TRADES_DATA' },
        { type: 'CHECK_ACCOUNT_ALLOWANCE' },
        { type: 'UPDATE_ASSETS' },
      ])
    },
  })
  test({
    description: 'account with address, loginId, name, isUnlocked, airbitzAccount',
    params: {
      account: {
        address: '0xb0b',
        name: 'jack',
        isUnlocked: true,
        airbitzAccount: { username: 'jack' },
      },
    },
    state: {
      loginAccount: {
        address: '0xb0b',
      },
      universe: {
        id: '0xdeadbeef',
      },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [
        { type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE' },
        { type: 'UPDATE_LOGIN_ACCOUNT', data: { address: '0xb0b', name: 'jack', isUnlocked: true, airbitzAccount: { username: 'jack' } } },
        { type: 'UPDATE_ACCOUNT_TRADES_DATA' },
        { type: 'CHECK_ACCOUNT_ALLOWANCE' },
        { type: 'UPDATE_ASSETS' },
      ])
    },
  })
})
