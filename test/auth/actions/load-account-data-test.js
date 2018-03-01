import { describe, it } from 'mocha'
import { assert } from 'chai'
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
      const UpdateLoginAccount = { updateLoginAccount: () => {} }
      const LoadAccountPositions = { loadAccountPositions: () => {} }
      const approveAccount = { checkAccountAllowance: () => {} }
      const action = proxyquire('../../../src/modules/auth/actions/load-account-data.js', {
        './load-account-data-from-local-storage': LoadAccountDataFromLocalStorage,
        './update-assets': UpdateAssets,
        './update-login-account': UpdateLoginAccount,
        '../../my-positions/actions/load-account-positions': LoadAccountPositions,
        './approve-account': approveAccount,
      })
      LoadAccountDataFromLocalStorage.loadAccountDataFromLocalStorage = sinon.stub().returns({ type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE' })
      sinon.stub(UpdateAssets, 'updateAssets').callsFake(callback => (dispatch) => {
        dispatch({ type: 'UPDATE_ASSETS' })
        if (callback) callback(null, t.blockchain.balances)
      })
      sinon.stub(UpdateLoginAccount, 'updateLoginAccount').callsFake(data => (dispatch) => {
        dispatch({ type: 'UPDATE_LOGIN_ACCOUNT', data })
      })
      sinon.stub(LoadAccountPositions, 'loadAccountPositions').callsFake(data => (dispatch) => {
        dispatch({ type: 'UPDATE_ACCOUNT_TRADES_DATA' })
      })
      sinon.stub(approveAccount, 'checkAccountAllowance').callsFake(data => (dispatch) => {
        dispatch({ type: 'CHECK_ACCOUNT_ALLOWANCE' })
      })
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
    blockchain: {
      balances: { rep: 0, ether: 0, realEther: 0 },
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
    blockchain: {
      balances: { rep: 0, ether: 0, realEther: 0 },
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
    blockchain: {
      balances: { rep: '1', ether: '2', realEther: '3' },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE',
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          address: '0xb0b',
        },
      }, {
        type: 'UPDATE_ACCOUNT_TRADES_DATA',
      }, {
        type: 'UPDATE_ASSETS',
      }, {
        type: 'CHECK_ACCOUNT_ALLOWANCE',
      }])
    },
  })
  test({
    description: 'account address, all 0 balances',
    params: {
      account: {
        address: '0xb0b',
      },
    },
    blockchain: {
      balances: { rep: 0, ether: 0, realEther: 0 },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE',
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          address: '0xb0b',
        },
      }, {
        type: 'UPDATE_ACCOUNT_TRADES_DATA',
      }, {
        type: 'UPDATE_ASSETS',
      }, {
        type: 'CHECK_ACCOUNT_ALLOWANCE',
      }])
    },
  })
  test({
    description: 'account address, single 0 balance',
    params: {
      account: {
        address: '0xb0b',
      },
    },
    blockchain: {
      balances: { rep: '2', ethTokens: '1', eth: 0 },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE',
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          address: '0xb0b',
        },
      }, {
        type: 'UPDATE_ACCOUNT_TRADES_DATA',
      }, {
        type: 'UPDATE_ASSETS',
      }, {
        type: 'CHECK_ACCOUNT_ALLOWANCE',
      }])
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
    blockchain: {
      balances: { rep: '1', ether: '2', realEther: '3' },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE',
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          address: '0xb0b',
          name: 'jack',
          isUnlocked: true,
          airbitzAccount: { username: 'jack' },
        },
      }, {
        type: 'UPDATE_ACCOUNT_TRADES_DATA',
      }, {
        type: 'UPDATE_ASSETS',
      }, {
        type: 'CHECK_ACCOUNT_ALLOWANCE',
      }])
    },
  })
  test({
    description: 'account with address and loginId',
    params: {
      account: {
        address: '0xb0b',
      },
    },
    blockchain: {
      balances: { rep: '1', ether: '2', realEther: '3' },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE',
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          address: '0xb0b',
        },
      }, {
        type: 'UPDATE_ACCOUNT_TRADES_DATA',
      }, {
        type: 'UPDATE_ASSETS',
      }, {
        type: 'CHECK_ACCOUNT_ALLOWANCE',
      }])
    },
  })
})
