import { describe, it } from 'mocha'
import { assert } from 'chai'
import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'

describe(`modules/auth/actions/load-register-block-number.js`, () => {
  proxyquire.noPreserveCache()
  const mockStore = configureMockStore([thunk])
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)
      const AugurJS = {
        augur: {
          accounts: { getRegisterBlockNumber: () => {} },
          api: { Register: { register: () => {} } },
          utils: { noop: () => {} }
        }
      }
      const LoadAccountHistory = {}
      const UpdateLoginAccount = { updateLoginAccount: () => {} }
      const action = proxyquire('../../../src/modules/auth/actions/load-register-block-number.js', {
        '../../../services/augurjs': AugurJS,
        './load-account-history': LoadAccountHistory,
        './update-login-account': UpdateLoginAccount
      })

      sinon.stub(AugurJS.augur.api.Register, 'register', (args) => {
        store.dispatch({ type: 'AUGURJS_REGISTER_REGISTER' })
        args.onSuccess({ blockNumber: t.blockchain.blockNumber })
      })
      sinon.stub(AugurJS.augur.accounts, 'getRegisterBlockNumber', (address, callback) => {
        store.dispatch({ type: 'AUGURJS_GET_REGISTER_BLOCK_NUMBER' })
        if (!callback) return t.blockchain.registerBlockNumber
        callback(null, t.blockchain.registerBlockNumber)
      })
      LoadAccountHistory.loadAccountHistory = sinon.stub().returns({ type: 'LOAD_ACCOUNT_HISTORY' })
      sinon.stub(UpdateLoginAccount, 'updateLoginAccount', data => dispatch => (
        dispatch({ type: 'UPDATE_LOGIN_ACCOUNT', data })
      ))
      store.dispatch(action.loadRegisterBlockNumber())
      t.assertions(store.getActions())
      store.clearActions()
    })
  }
  test({
    description: 'no account',
    state: {
      loginAccount: {}
    },
    blockchain: {
      registerBlockNumber: null
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })
  test({
    description: 'account with register block number in state',
    state: {
      loginAccount: {
        address: '0xb0b',
        registerBlockNumber: 123
      }
    },
    blockchain: {
      registerBlockNumber: 123
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'LOAD_ACCOUNT_HISTORY'
      }])
    }
  })
  test({
    description: 'account with register block number on chain',
    state: {
      loginAccount: {
        address: '0xb0b'
      }
    },
    blockchain: {
      registerBlockNumber: 123
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'AUGURJS_GET_REGISTER_BLOCK_NUMBER'
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { registerBlockNumber: 123 }
      }, {
        type: 'LOAD_ACCOUNT_HISTORY'
      }])
    }
  })
  test({
    description: 'account without register block number',
    state: {
      loginAccount: {
        address: '0xb0b'
      }
    },
    blockchain: {
      registerBlockNumber: null,
      blockNumber: 456
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'AUGURJS_GET_REGISTER_BLOCK_NUMBER'
      }, {
        type: 'AUGURJS_REGISTER_REGISTER'
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { registerBlockNumber: 456 }
      }, {
        type: 'LOAD_ACCOUNT_HISTORY'
      }])
    }
  })
})
