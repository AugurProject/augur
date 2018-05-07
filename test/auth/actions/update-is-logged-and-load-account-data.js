

import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'

describe(`modules/auth/actions/update-is-logged-and-load-account-data.js`, () => {
  proxyquire.noPreserveCache()
  const mockStore = configureMockStore([thunk])
  const test = t => it(t.description, () => {
    const store = mockStore(t.state)
    const AugurJS = { augur: { rpc: { clear: () => {} } } }
    const LoadAccountData = { loadAccountData: () => {} }
    const action = proxyquire('../../../src/modules/auth/actions/update-is-logged-and-load-account-data.js', {
      '../../../services/augurjs': AugurJS,
      './load-account-data': LoadAccountData,
    })
    sinon.stub(AugurJS.augur.rpc, 'clear').callsFake(() => store.dispatch({ type: 'AUGURJS_RPC_CLEAR' }))
    sinon.stub(LoadAccountData, 'loadAccountData').callsFake(account => ({ type: 'LOAD_ACCOUNT_DATA', account }))
    store.dispatch(action.updateIsLoggedAndLoadAccountData(t.params.unlockedAddress, t.params.accountType))
    t.assertions(store.getActions())
    store.clearActions()
  })
  test({
    description: 'unlocked ethereum node',
    params: {
      unlockedAddress: '0xb0b',
      accountType: 'unlockedEthereumNode',
    },
    assertions: actions => assert.deepEqual(actions, [
      { type: 'AUGURJS_RPC_CLEAR' },
      { type: 'CLEAR_LOGIN_ACCOUNT' },
      { type: 'UPDATE_IS_LOGGED', data: { isLogged: true } },
      { type: 'LOAD_ACCOUNT_DATA', account: { address: '0xb0b', displayAddress: '0xB0B', meta: { accountType: 'unlockedEthereumNode', address: '0xb0b', signer: null } } },
    ]),
  })
  test({
    description: 'metamask',
    params: {
      unlockedAddress: '0xb0b',
      accountType: 'metaMask',
    },
    assertions: actions => assert.deepEqual(actions, [
      { type: 'AUGURJS_RPC_CLEAR' },
      { type: 'CLEAR_LOGIN_ACCOUNT' },
      { type: 'UPDATE_IS_LOGGED', data: { isLogged: true } },
      { type: 'LOAD_ACCOUNT_DATA', account: { address: '0xb0b', displayAddress: '0xB0B', meta: { accountType: 'metaMask', address: '0xb0b', signer: null } } },
    ]),
  })
})
