import { describe, it } from 'mocha'
import mockStore from 'test/mockStore'
import { handleAugurNodeDisconnect, handleEthereumDisconnect, __RewireAPI__ as RewireDisconnectHandlers } from 'modules/events/actions/disconnect-handlers'
import { __RewireAPI__ as RewireReInitAugur } from 'modules/app/actions/re-init-augur'

describe('events/actions/disconnect-handlers', () => {
  const mockHistory = { push: arg => assert.deepEqual(arg, '/categories') }
  describe('handleAugurNodeDisconnect', () => {
    const test = t => it(t.description, (done) => {
      const store = mockStore.mockStore(t.state)
      RewireReInitAugur.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => {
        assert.deepEqual(history, t.params.history)
        assert.isFalse(isInitialConnection)
        assert.deepEqual(env, store.getState().env)
        cb()
        // just to confirm this is actually called.
        return { type: 'CONNECT_AUGUR' }
      })
      RewireReInitAugur.__Rewire__('debounce', (func, wait) => {
        assert.deepEqual(wait, 3000)
        assert.isFunction(func)
        return (cb) => {
          // flip the connection.isReconnectionPaused value, should go from false to true, then true to false on the 2nd call.
          t.state.connection.isReconnectionPaused = !t.state.connection.isReconnectionPaused
          func(cb)
        }
      })
      RewireDisconnectHandlers.__Rewire__('updateAugurNodeConnectionStatus', (isConnected) => {
        t.state.connection.isConnectedToAugurNode = isConnected
        return { type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS', isConnected: false }
      })
      store.dispatch(handleAugurNodeDisconnect(t.params.history))
      t.assertions(store.getActions())
      done()
    })
    test({
      description: 'it should handle a augurNode disconnection event with pausedReconnection',
      params: {
        history: mockHistory,
      },
      state: {
        connection: { isConnected: true, isConnectedToAugurNode: true, isReconnectionPaused: false },
      },
      assertions: actions => assert.deepEqual(actions, [
        { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: true, isConnectedToAugurNode: false, isReconnectionPaused: false }, env: undefined } },
        { type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS', isConnected: false },
        { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: true, isConnectedToAugurNode: false, isReconnectionPaused: false }, env: undefined } },
        { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: true, isConnectedToAugurNode: false, isReconnectionPaused: false }, env: undefined } },
        { type: 'CONNECT_AUGUR' },
      ]),
    })
  })
  describe('handleEthereumDisconnect', () => {
    const test = t => it(t.description, (done) => {
      const store = mockStore.mockStore(t.state)
      RewireDisconnectHandlers.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => {
        assert.deepEqual(history, mockHistory)
        assert.isFalse(isInitialConnection)
        assert.deepEqual(env, store.getState().env)
        cb()
        // just to confirm this is actually called.
        return { type: 'CONNECT_AUGUR' }
      })
      RewireDisconnectHandlers.__Rewire__('debounce', (func, wait) => {
        assert.deepEqual(wait, 3000)
        assert.isFunction(func)
        return (cb) => {
          // flip the connection.isReconnectionPaused value, should go from false to true, then true to false on the 2nd call.
          t.state.connection.isReconnectionPaused = !t.state.connection.isReconnectionPaused
          func(cb)
        }
      })
      RewireDisconnectHandlers.__Rewire__('updateConnectionStatus', (isConnected) => {
        t.state.connection.isConnected = isConnected
        return { type: 'UPDATE_CONNECTION_STATUS', isConnected: false }
      })
      store.dispatch(handleEthereumDisconnect(t.params.history))
      done()
    })
    test({
      description: 'it should handle a ethereumNode disconnection event with pausedReconnection',
      params: {
        history: mockHistory,
      },
      state: {
        connection: { isConnected: true, isConnectedToAugurNode: true, isReconnectionPaused: false },
      },
      assertions: actions => assert.deepEqual(actions, [
        { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: true, isConnectedToAugurNode: true, isReconnectionPaused: false }, env: undefined } },
        { type: 'UPDATE_CONNECTION_STATUS', isConnected: false },
        { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: true, isConnectedToAugurNode: true, isReconnectionPaused: false }, env: undefined } },
        { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: true, isConnectedToAugurNode: true, isReconnectionPaused: false }, env: undefined } },
        { type: 'CONNECT_AUGUR' },
      ]),
    })
  })
})
