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
      const AugurJS = {
        augur: {
          getRegisterBlockNumber: () => {},
          Register: {
            register: () => {}
          }
        }
      }
      const FundNewAccount = { fundNewAccount: () => {} }
      const LoadAccountDataFromLocalStorage = {}
      const LoadRegisterBlockNumber = {}
      const UpdateAssets = { updateAssets: () => {} }
      const UpdateLoginAccount = { updateLoginAccount: () => {} }
      const action = proxyquire('../../../src/modules/auth/actions/load-account-data.js', {
        '../../../services/augurjs': AugurJS,
        './fund-new-account': FundNewAccount,
        './load-account-data-from-local-storage': LoadAccountDataFromLocalStorage,
        './load-register-block-number': LoadRegisterBlockNumber,
        './update-assets': UpdateAssets,
        './update-login-account': UpdateLoginAccount
      })

      sinon.stub(AugurJS.augur.Register, 'register', params => params.onSuccess({ callReturn: '1' }))
      sinon.stub(AugurJS.augur, 'getRegisterBlockNumber', (address, callback) => {
        if (!callback) return t.blockchain.registerBlockNumber
        callback(null, t.blockchain.registerBlockNumber)
      })
      sinon.stub(FundNewAccount, 'fundNewAccount', () => (dispatch, getState) => {
        dispatch({ type: 'FUND_NEW_ACCOUNT' })
      })
      LoadAccountDataFromLocalStorage.loadAccountDataFromLocalStorage = sinon.stub().returns({ type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE' })
      LoadRegisterBlockNumber.loadRegisterBlockNumber = sinon.stub().returns({ type: 'LOAD_REGISTER_BLOCK_NUMBER' })
      sinon.stub(UpdateAssets, 'updateAssets', callback => (dispatch) => {
        dispatch({ type: 'UPDATE_ASSETS' })
        if (callback) callback(null, t.blockchain.balances)
      })
      sinon.stub(UpdateLoginAccount, 'updateLoginAccount', data => (dispatch) => {
        dispatch({ type: 'UPDATE_LOGIN_ACCOUNT', data })
      })
      store.dispatch(action.loadAccountData(t.params.account))
      t.assertions(store.getActions())
      store.clearActions()
    })
  }
  test({
    description: 'no account',
    params: {
      account: null
    },
    blockchain: {
      balances: { rep: 0, ether: 0, realEther: 0 }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'account without address',
    params: {
      account: { name: 'jack' }
    },
    blockchain: {
      balances: { rep: 0, ether: 0, realEther: 0 }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'account address',
    params: {
      account: {
        address: '0xb0b'
      }
    },
    blockchain: {
      balances: { rep: '1', ether: '2', realEther: '3' }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE'
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { address: '0xb0b' }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_REGISTER_BLOCK_NUMBER'
      }])
    }
  })
  test({
    description: 'account address, all 0 balances',
    params: {
      account: {
        address: '0xb0b'
      }
    },
    blockchain: {
      balances: { rep: 0, ether: 0, realEther: 0 }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE'
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { address: '0xb0b' }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'FUND_NEW_ACCOUNT'
      }])
    }
  })
  test({
    description: 'account address, single 0 balance',
    params: {
      account: {
        address: '0xb0b'
      }
    },
    blockchain: {
      balances: { rep: '2', ethTokens: '1', eth: 0 }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE'
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { address: '0xb0b' }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'FUND_NEW_ACCOUNT'
      }])
    }
  })
  test({
    description: 'account with address, loginID, name, isUnlocked, airbitzAccount',
    params: {
      account: {
        address: '0xb0b',
        loginID: 'loginID',
        name: 'jack',
        isUnlocked: true,
        airbitzAccount: { username: 'jack' }
      }
    },
    blockchain: {
      balances: { rep: '1', ether: '2', realEther: '3' }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE'
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          address: '0xb0b',
          loginID: 'loginID',
          name: 'jack',
          isUnlocked: true,
          airbitzAccount: { username: 'jack' }
        }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_REGISTER_BLOCK_NUMBER'
      }])
    }
  })
  test({
    description: 'account with address and loginID',
    params: {
      account: {
        address: '0xb0b',
        loginID: 'loginID'
      }
    },
    blockchain: {
      balances: { rep: '1', ether: '2', realEther: '3' }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_DATA_FROM_LOCAL_STORAGE'
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          address: '0xb0b',
          loginID: 'loginID'
        }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_REGISTER_BLOCK_NUMBER'
      }])
    }
  })
})
