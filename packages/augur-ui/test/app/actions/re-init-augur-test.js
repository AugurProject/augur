import { describe, it } from 'mocha'
import mockStore from 'test/mockStore'
import { reInitAugur, __RewireAPI__ as RewireReInitAugur } from 'modules/app/actions/re-init-augur'

describe('app/actions/re-init-augur', () => {
  const mockHistory = { push: arg => assert.deepEqual(arg, '/categories') }
  const test = t => it(t.description, (done) => {
    let connectAugurCallCount = 0
    const store = mockStore.mockStore(t.state)
    RewireReInitAugur.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => {
      connectAugurCallCount += 1
      assert.deepEqual(history, t.params.history)
      assert.isFalse(isInitialConnection)
      assert.deepEqual(env, store.getState().env)
      // fail the first 3 attempts and then finally pass empty cb.
      if (connectAugurCallCount > 3) {
        cb()
      } else {
        cb({ error: 'some error', message: 'unable to connect' })
      }
      // just to confirm this is actually called.
      return { type: 'CONNECT_AUGUR' }
    })
    RewireReInitAugur.__Rewire__('debounce', (func, wait) => {
      assert.deepEqual(wait, 3000)
      assert.isFunction(func)
      return func
    })
    store.dispatch(reInitAugur(t.params.history))
    t.assertions(store.getActions())
    done()
  })
  test({
    description: 'it should handle calling connectAugur more than once if there is an error the first time',
    params: {
      history: mockHistory,
    },
    state: {
      connection: { isConnected: false, isConnectedToAugurNode: true, isReconnectionPaused: false },
    },
    assertions: actions => assert.deepEqual(actions, [
      { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: false, isConnectedToAugurNode: true, isReconnectionPaused: false }, env: undefined } },
      { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: false, isConnectedToAugurNode: true, isReconnectionPaused: false }, env: undefined } },
      { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: false, isConnectedToAugurNode: true, isReconnectionPaused: false }, env: undefined } },
      { type: 'UPDATE_MODAL', data: { type: 'MODAL_NETWORK_DISCONNECTED', connection: { isConnected: false, isConnectedToAugurNode: true, isReconnectionPaused: false }, env: undefined } },
      { type: 'CONNECT_AUGUR' },
      { type: 'CONNECT_AUGUR' },
      { type: 'CONNECT_AUGUR' },
      { type: 'CONNECT_AUGUR' },
    ]),
  })
})
