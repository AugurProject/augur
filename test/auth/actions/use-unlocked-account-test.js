

import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'

const MOCK_ERROR = { error: 42, message: 'fail!' }

describe(`modules/auth/actions/use-unlocked-account.js`, () => {
  proxyquire.noPreserveCache()
  const mockStore = configureMockStore([thunk])
  const test = t => it(t.description, (done) => {
    const store = mockStore(t.state)
    const AugurJS = {
      augur: {
        rpc: {
          constants: {
            ACCOUNT_TYPES: {
              UNLOCKED_ETHEREUM_NODE: 'unlockedEthereumNode',
              META_MASK: 'metaMask',
            },
          },
          isUnlocked: () => {},
        },
      },
    }
    const UpdateIsLoggedAndLoadAccountData = { updateIsLoggedAndLoadAccountData: () => {} }
    const IsGlobalWeb3 = { default: () => {} }
    const action = proxyquire('../../../src/modules/auth/actions/use-unlocked-account.js', {
      '../../../services/augurjs': AugurJS,
      './update-is-logged-and-load-account-data': UpdateIsLoggedAndLoadAccountData,
      '../helpers/is-global-web3': IsGlobalWeb3,
    })
    sinon.stub(AugurJS.augur.rpc, 'isUnlocked').callsFake((address, callback) => {
      t.stub.augur.rpc.isUnlocked(address, (err, isUnlocked) => {
        store.dispatch({ type: 'AUGURJS_RPC_IS_UNLOCKED', data: { isUnlocked: err || isUnlocked } })
        if (err) return callback(err)
        callback(null, isUnlocked)
      })
    })
    sinon.stub(UpdateIsLoggedAndLoadAccountData, 'updateIsLoggedAndLoadAccountData').callsFake((unlockedAccount, accountType) => ({
      type: 'UPDATE_IS_LOGGED_AND_LOAD_ACCOUNT_DATA',
      data: { unlockedAccount, accountType },
    }))
    sinon.stub(IsGlobalWeb3, 'default').callsFake(() => {
      const isGlobalWeb3 = t.stub.isGlobalWeb3()
      store.dispatch({ type: 'IS_GLOBAL_WEB3', data: { isGlobalWeb3 } })
      return isGlobalWeb3
    })
    store.dispatch(action.useUnlockedAccount(t.params.unlockedAddress, (err) => {
      t.assertions(err, store.getActions())
      store.clearActions()
      done()
    }))
  })
  test({
    description: 'no address',
    params: {
      unlockedAddress: undefined,
    },
    stub: {
      augur: { rpc: { isUnlocked: (address, callback) => callback(null, null) } },
      isGlobalWeb3: () => assert.fail(),
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'no account address')
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'isUnlocked error',
    params: {
      unlockedAddress: '0xb0b',
    },
    stub: {
      augur: { rpc: { isUnlocked: (address, callback) => callback(MOCK_ERROR) } },
      isGlobalWeb3: () => false,
    },
    assertions: (err, actions) => {
      assert.deepEqual(err, MOCK_ERROR)
      assert.deepEqual(actions, [{
        type: 'IS_GLOBAL_WEB3',
        data: { isGlobalWeb3: false },
      }, {
        type: 'AUGURJS_RPC_IS_UNLOCKED',
        data: { isUnlocked: MOCK_ERROR },
      }])
    },
  })
  test({
    description: 'locked address',
    params: {
      unlockedAddress: '0xb0b',
    },
    stub: {
      augur: { rpc: { isUnlocked: (address, callback) => callback(null, false) } },
      isGlobalWeb3: () => false,
    },
    assertions: (err, actions) => {
      assert.isNull(err)
      assert.deepEqual(actions, [{
        type: 'IS_GLOBAL_WEB3',
        data: { isGlobalWeb3: false },
      }, {
        type: 'AUGURJS_RPC_IS_UNLOCKED',
        data: { isUnlocked: false },
      }])
    },
  })
  test({
    description: 'using metamask',
    params: {
      unlockedAddress: '0xb0b',
    },
    stub: {
      augur: { rpc: { isUnlocked: (address, callback) => assert.fail() } },
      isGlobalWeb3: () => true,
    },
    assertions: (err, actions) => {
      assert.isNull(err)
      assert.deepEqual(actions, [{
        type: 'IS_GLOBAL_WEB3',
        data: { isGlobalWeb3: true },
      }, {
        type: 'UPDATE_IS_LOGGED_AND_LOAD_ACCOUNT_DATA',
        data: {
          unlockedAccount: '0xb0b',
          accountType: 'metaMask',
        },
      }])
    },
  })
  test({
    description: 'unlocked local account',
    params: {
      unlockedAddress: '0xb0b',
    },
    stub: {
      augur: { rpc: { isUnlocked: (address, callback) => callback(null, true) } },
      isGlobalWeb3: () => false,
    },
    assertions: (err, actions) => {
      assert.deepEqual(actions, [{
        type: 'IS_GLOBAL_WEB3',
        data: { isGlobalWeb3: false },
      }, {
        type: 'AUGURJS_RPC_IS_UNLOCKED',
        data: { isUnlocked: true },
      }, {
        type: 'UPDATE_IS_LOGGED_AND_LOAD_ACCOUNT_DATA',
        data: {
          unlockedAccount: '0xb0b',
          accountType: 'unlockedEthereumNode',
        },
      }])
    },
  })
})
