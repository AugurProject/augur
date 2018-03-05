import { describe, it, afterEach } from 'mocha'
import { assert } from 'chai'
import mockStore from 'test/mockStore'

import { listenToUpdates, __RewireAPI__ as ReWireModule } from 'modules/app/actions/listen-to-updates'

describe('listen-to-updates', () => {
  const test = t => it(t.description, done => t.assertions(done))
  const { store, state } = mockStore
  const mockHistory = {
    push: arg => assert.deepEqual(arg, '/categories'),
  }
  afterEach(() => {
    store.clearActions()
  })

  describe('setup shape tests', () => {
    const ACTIONS = {
      STOP_BLOCK_LISTENERS: { type: 'STOP_BLOCK_LISTENERS' },
      STOP_AUGUR_NODE_EVENT_LISTENERS: { type: 'STOP_AUGUR_NODE_EVENT_LISTENERS' },
      STOP_BLOCKCHAIN_EVENT_LISTENERS: { type: 'STOP_BLOCKCHAIN_EVENT_LISTENERS' },
      START_BLOCK_LISTENERS: { type: 'START_BLOCK_LISTENERS' },
      START_AUGUR_NODE_EVENT_LISTENERS: { type: 'START_AUGUR_NODE_EVENT_LISTENERS' },
      NODES_AUGUR_ON_SET: { type: 'NODES_AUGUR_ON_SET' },
      NODES_ETHEREUM_ON_SET: { type: 'NODES_ETHEREUM_ON_SET' },
    }
    test({
      description: 'it should handle clearing all listeners then setting all listeners when called.',
      assertions: (done) => {
        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => store.dispatch(ACTIONS.STOP_BLOCK_LISTENERS),
            stopAugurNodeEventListeners: () => store.dispatch(ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS),
            stopBlockchainEventListeners: () => store.dispatch(ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS),
            startBlockListeners: (args) => {
              assert.isFunction(args.onAdded, `Didn't pass a function to startBlockListeners.onAdded as expected.`)
              assert.isFunction(args.onRemoved, `Didn't pass a function to startBlockListeners.onRemoved as expected.`)
              store.dispatch(ACTIONS.START_BLOCK_LISTENERS)
            },
            startAugurNodeEventListeners: (args) => {
              assert.isFunction(args.MarketState, `Didn't pass a function to startAugurNodeListeners.MarketState as expected.`)
              assert.isFunction(args.InitialReportSubmitted, `Didn't pass a function to startAugurNodeListeners.InitialReportSubmitted as expected.`)
              assert.isFunction(args.MarketCreated, `Didn't pass a function to startAugurNodeListeners.MarketCreated as expected.`)
              assert.isFunction(args.TokensTransferred, `Didn't pass a function to startAugurNodeListeners.TokensTransferred as expected.`)
              assert.isFunction(args.OrderCanceled, `Didn't pass a function to startAugurNodeListeners.OrderCanceled as expected.`)
              assert.isFunction(args.OrderCreated, `Didn't pass a function to startAugurNodeListeners.OrderCreated as expected.`)
              assert.isFunction(args.OrderFilled, `Didn't pass a function to startAugurNodeListeners.OrderFilled as expected.`)
              assert.isFunction(args.TradingProceedsClaimed, `Didn't pass a function to startAugurNodeListeners.TradingProceedsClaimed as expected.`)
              assert.isFunction(args.DesignatedReportSubmitted, `Didn't pass a function to startAugurNodeListeners.DesignatedReportSubmitted as expected.`)
              assert.isFunction(args.ReportSubmitted, `Didn't pass a function to startAugurNodeListeners.ReportSubmitted as expected.`)
              assert.isFunction(args.WinningTokensRedeemed, `Didn't pass a function to startAugurNodeListeners.WinningTokensRedeemed as expected.`)
              assert.isFunction(args.ReportsDisputed, `Didn't pass a function to startAugurNodeListeners.ReportsDisputed as expected.`)
              assert.isFunction(args.MarketFinalized, `Didn't pass a function to startAugurNodeListeners.MarketFinalized as expected.`)
              assert.isFunction(args.UniverseForked, `Didn't pass a function to startAugurNodeListeners.UniverseForked as expected.`)
              store.dispatch(ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS)
            },
            nodes: {
              augur: {
                on: (label, func) => {
                  assert.deepEqual(label, 'disconnect', `expected the disconnect label to be passed to augur.nodes.augur.on`)
                  assert.isFunction(func, `Expected augur.nodes.augur.on to have a function passed as the second argument.`)
                  store.dispatch(ACTIONS.NODES_AUGUR_ON_SET)
                },
              },
              ethereum: {
                on: (label, func) => {
                  assert.deepEqual(label, 'disconnect', `expected the disconnect label to be passed to augur.nodes.ethereum.on`)
                  assert.isFunction(func, `Expected augur.nodes.ethereum.on to have a function passed as the second argument.`)
                  store.dispatch(ACTIONS.NODES_ETHEREUM_ON_SET)
                },
              },
            },
          },
        })
        store.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(store.getActions(), [
          ACTIONS.STOP_BLOCK_LISTENERS,
          ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS,
          ACTIONS.START_BLOCK_LISTENERS,
          ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.NODES_AUGUR_ON_SET,
          ACTIONS.NODES_ETHEREUM_ON_SET,
        ], `Didn't get the expected actions emitted.`)
        done()
      },
    })
  })

  describe('Node disconnection tests', () => {
    test({
      description: 'it should handle a augurNode disconnection event',
      assertions: (done) => {
        const testState = Object.assign({}, state, {
          connection: {
            ...state.connection,
            isConnected: true,
            isConnectedToAugurNode: true,
          },
        })
        const testStore = mockStore.mockStore(testState)
        const ACTIONS = {
          STOP_BLOCK_LISTENERS: { type: 'STOP_BLOCK_LISTENERS' },
          STOP_AUGUR_NODE_EVENT_LISTENERS: { type: 'STOP_AUGUR_NODE_EVENT_LISTENERS' },
          STOP_BLOCKCHAIN_EVENT_LISTENERS: { type: 'STOP_BLOCKCHAIN_EVENT_LISTENERS' },
          START_BLOCK_LISTENERS: { type: 'START_BLOCK_LISTENERS' },
          START_AUGUR_NODE_EVENT_LISTENERS: { type: 'START_AUGUR_NODE_EVENT_LISTENERS' },
          NODES_AUGUR_ON_SET: { type: 'NODES_AUGUR_ON_SET' },
          RESET_STATE: { type: 'RESET_STATE' },
          UPDATE_CONNECTION_STATUS: {
            type: 'UPDATE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_AUGUR_NODE_CONNECTION_STATUS: {
            type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_MODAL: {
            type: 'UPDATE_MODAL',
            data: {
              type: 'MODAL_NETWORK_DISCONNECTED',
              connection: testState.connection,
              env: testState.env,
            },
          },
          NODES_ETHEREUM_ON_SET: { type: 'NODES_ETHEREUM_ON_SET' },
          CONNECT_AUGUR: { type: 'CONNECT_AUGUR' },
        }

        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCK_LISTENERS),
            stopAugurNodeEventListeners: () => testStore.dispatch(ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS),
            stopBlockchainEventListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS),
            startBlockListeners: (args) => {
              testStore.dispatch(ACTIONS.START_BLOCK_LISTENERS)
            },
            startAugurNodeEventListeners: (args) => {
              testStore.dispatch(ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS)
            },
            nodes: {
              augur: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_AUGUR_ON_SET)
                  func()
                },
              },
              ethereum: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_ETHEREUM_ON_SET)
                },
              },
            },
          },
        })
        ReWireModule.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => {
          assert.deepEqual(history, mockHistory)
          assert.isFalse(isInitialConnection)
          assert.deepEqual(env, testStore.getState().env)
          cb()
          // just to confirm this is actually called.
          return ACTIONS.CONNECT_AUGUR
        })
        ReWireModule.__Rewire__('debounce', (func, wait) => {
          assert.deepEqual(wait, 3000)
          assert.isFunction(func)
          return func
        })
        ReWireModule.__Rewire__('resetState', () => {
          testState.connection.isConnectedToAugurNode = false
          // testState.connection.isConnected = false
          return ACTIONS.RESET_STATE
        })
        testStore.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(testStore.getActions(), [
          ACTIONS.STOP_BLOCK_LISTENERS,
          ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS,
          ACTIONS.START_BLOCK_LISTENERS,
          ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.NODES_AUGUR_ON_SET,
          ACTIONS.RESET_STATE,
          ACTIONS.UPDATE_CONNECTION_STATUS,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.CONNECT_AUGUR,
          ACTIONS.NODES_ETHEREUM_ON_SET,
        ], `Didn't recieve the expected actions`)
        done()
      },
    })

    test({
      description: 'it should handle a augurNode disconnection event',
      assertions: (done) => {
        const testState = Object.assign({}, state, {
          connection: {
            ...state.connection,
            isConnected: true,
            isConnectedToAugurNode: true,
          },
        })
        const testStore = mockStore.mockStore(testState)
        const ACTIONS = {
          STOP_BLOCK_LISTENERS: { type: 'STOP_BLOCK_LISTENERS' },
          STOP_AUGUR_NODE_EVENT_LISTENERS: { type: 'STOP_AUGUR_NODE_EVENT_LISTENERS' },
          STOP_BLOCKCHAIN_EVENT_LISTENERS: { type: 'STOP_BLOCKCHAIN_EVENT_LISTENERS' },
          START_BLOCK_LISTENERS: { type: 'START_BLOCK_LISTENERS' },
          START_AUGUR_NODE_EVENT_LISTENERS: { type: 'START_AUGUR_NODE_EVENT_LISTENERS' },
          NODES_AUGUR_ON_SET: { type: 'NODES_AUGUR_ON_SET' },
          RESET_STATE: { type: 'RESET_STATE' },
          UPDATE_AUGUR_NODE_CONNECTION_STATUS: {
            type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_CONNECTION_STATUS: {
            type: 'UPDATE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_MODAL: {
            type: 'UPDATE_MODAL',
            data: {
              type: 'MODAL_NETWORK_DISCONNECTED',
              connection: testState.connection,
              env: testState.env,
            },
          },
          NODES_ETHEREUM_ON_SET: { type: 'NODES_ETHEREUM_ON_SET' },
          CONNECT_AUGUR: { type: 'CONNECT_AUGUR' },
        }

        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCK_LISTENERS),
            stopAugurNodeEventListeners: () => testStore.dispatch(ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS),
            stopBlockchainEventListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS),
            startBlockListeners: (args) => {
              testStore.dispatch(ACTIONS.START_BLOCK_LISTENERS)
            },
            startAugurNodeEventListeners: (args) => {
              testStore.dispatch(ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS)
            },
            nodes: {
              augur: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_AUGUR_ON_SET)
                },
              },
              ethereum: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_ETHEREUM_ON_SET)
                  func()
                },
              },
            },
          },
        })
        ReWireModule.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => {
          assert.deepEqual(history, mockHistory)
          assert.isFalse(isInitialConnection)
          assert.deepEqual(env, testStore.getState().env)
          cb()
          // just to confirm this is actually called.
          return ACTIONS.CONNECT_AUGUR
        })
        ReWireModule.__Rewire__('debounce', (func, wait) => {
          assert.deepEqual(wait, 3000)
          assert.isFunction(func)
          return func
        })
        ReWireModule.__Rewire__('resetState', () => {
          // testState.connection.isConnectedToAugurNode = false
          testState.connection.isConnected = false
          return ACTIONS.RESET_STATE
        })
        testStore.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(testStore.getActions(), [
          ACTIONS.STOP_BLOCK_LISTENERS,
          ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS,
          ACTIONS.START_BLOCK_LISTENERS,
          ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.NODES_AUGUR_ON_SET,
          ACTIONS.NODES_ETHEREUM_ON_SET,
          ACTIONS.RESET_STATE,
          ACTIONS.UPDATE_AUGUR_NODE_CONNECTION_STATUS,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.CONNECT_AUGUR,
        ], `Didn't recieve the expected actions`)
        done()
      },
    })

    test({
      description: 'it should handle a augurNode disconnection event with pausedReconnection',
      assertions: (done) => {
        const testState = Object.assign({}, state, {
          connection: {
            ...state.connection,
            isConnected: true,
            isConnectedToAugurNode: true,
            isReconnectionPaused: false,
          },
        })
        const testStore = mockStore.mockStore(testState)
        const ACTIONS = {
          STOP_BLOCK_LISTENERS: { type: 'STOP_BLOCK_LISTENERS' },
          STOP_AUGUR_NODE_EVENT_LISTENERS: { type: 'STOP_AUGUR_NODE_EVENT_LISTENERS' },
          STOP_BLOCKCHAIN_EVENT_LISTENERS: { type: 'STOP_BLOCKCHAIN_EVENT_LISTENERS' },
          START_BLOCK_LISTENERS: { type: 'START_BLOCK_LISTENERS' },
          START_AUGUR_NODE_EVENT_LISTENERS: { type: 'START_AUGUR_NODE_EVENT_LISTENERS' },
          NODES_AUGUR_ON_SET: { type: 'NODES_AUGUR_ON_SET' },
          RESET_STATE: { type: 'RESET_STATE' },
          UPDATE_CONNECTION_STATUS: {
            type: 'UPDATE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_AUGUR_NODE_CONNECTION_STATUS: {
            type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_MODAL: {
            type: 'UPDATE_MODAL',
            data: {
              type: 'MODAL_NETWORK_DISCONNECTED',
              connection: testState.connection,
              env: testState.env,
            },
          },
          NODES_ETHEREUM_ON_SET: { type: 'NODES_ETHEREUM_ON_SET' },
          CONNECT_AUGUR: { type: 'CONNECT_AUGUR' },
        }

        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCK_LISTENERS),
            stopAugurNodeEventListeners: () => testStore.dispatch(ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS),
            stopBlockchainEventListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS),
            startBlockListeners: (args) => {
              testStore.dispatch(ACTIONS.START_BLOCK_LISTENERS)
            },
            startAugurNodeEventListeners: (args) => {
              testStore.dispatch(ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS)
            },
            nodes: {
              augur: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_AUGUR_ON_SET)
                  func()
                },
              },
              ethereum: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_ETHEREUM_ON_SET)
                },
              },
            },
          },
        })
        ReWireModule.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => {
          assert.deepEqual(history, mockHistory)
          assert.isFalse(isInitialConnection)
          assert.deepEqual(env, testStore.getState().env)
          cb()
          // just to confirm this is actually called.
          return ACTIONS.CONNECT_AUGUR
        })
        ReWireModule.__Rewire__('debounce', (func, wait) => {
          assert.deepEqual(wait, 3000)
          assert.isFunction(func)
          return (cb) => {
            // flip the connection.isReconnectionPaused value, should go from false to true, then true to false on the 2nd call.
            testState.connection.isReconnectionPaused = !testState.connection.isReconnectionPaused
            func(cb)
          }
        })
        ReWireModule.__Rewire__('resetState', () => {
          testState.connection.isConnectedToAugurNode = false
          // testState.connection.isConnected = false
          return ACTIONS.RESET_STATE
        })
        testStore.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(testStore.getActions(), [
          ACTIONS.STOP_BLOCK_LISTENERS,
          ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS,
          ACTIONS.START_BLOCK_LISTENERS,
          ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.NODES_AUGUR_ON_SET,
          ACTIONS.RESET_STATE,
          ACTIONS.UPDATE_CONNECTION_STATUS,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.CONNECT_AUGUR,
          ACTIONS.NODES_ETHEREUM_ON_SET,
        ], `Didn't recieve the expected actions`)
        done()
      },
    })

    test({
      description: 'it should handle a ethereumNode disconnection event with pausedReconnection',
      assertions: (done) => {
        const testState = Object.assign({}, state, {
          connection: {
            ...state.connection,
            isConnected: true,
            isConnectedToAugurNode: true,
            isReconnectionPaused: false,
          },
        })
        const testStore = mockStore.mockStore(testState)
        const ACTIONS = {
          STOP_BLOCK_LISTENERS: { type: 'STOP_BLOCK_LISTENERS' },
          STOP_AUGUR_NODE_EVENT_LISTENERS: { type: 'STOP_AUGUR_NODE_EVENT_LISTENERS' },
          STOP_BLOCKCHAIN_EVENT_LISTENERS: { type: 'STOP_BLOCKCHAIN_EVENT_LISTENERS' },
          START_BLOCK_LISTENERS: { type: 'START_BLOCK_LISTENERS' },
          START_AUGUR_NODE_EVENT_LISTENERS: { type: 'START_AUGUR_NODE_EVENT_LISTENERS' },
          NODES_AUGUR_ON_SET: { type: 'NODES_AUGUR_ON_SET' },
          RESET_STATE: { type: 'RESET_STATE' },
          UPDATE_CONNECTION_STATUS: {
            type: 'UPDATE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_AUGUR_NODE_CONNECTION_STATUS: {
            type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_MODAL: {
            type: 'UPDATE_MODAL',
            data: {
              type: 'MODAL_NETWORK_DISCONNECTED',
              connection: testState.connection,
              env: testState.env,
            },
          },
          NODES_ETHEREUM_ON_SET: { type: 'NODES_ETHEREUM_ON_SET' },
          CONNECT_AUGUR: { type: 'CONNECT_AUGUR' },
        }

        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCK_LISTENERS),
            stopAugurNodeEventListeners: () => testStore.dispatch(ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS),
            stopBlockchainEventListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS),
            startBlockListeners: (args) => {
              testStore.dispatch(ACTIONS.START_BLOCK_LISTENERS)
            },
            startAugurNodeEventListeners: (args) => {
              testStore.dispatch(ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS)
            },
            nodes: {
              augur: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_AUGUR_ON_SET)
                },
              },
              ethereum: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_ETHEREUM_ON_SET)
                  func()
                },
              },
            },
          },
        })
        ReWireModule.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => {
          assert.deepEqual(history, mockHistory)
          assert.isFalse(isInitialConnection)
          assert.deepEqual(env, testStore.getState().env)
          cb()
          // just to confirm this is actually called.
          return ACTIONS.CONNECT_AUGUR
        })
        ReWireModule.__Rewire__('debounce', (func, wait) => {
          assert.deepEqual(wait, 3000)
          assert.isFunction(func)
          return (cb) => {
            // flip the connection.isReconnectionPaused value, should go from false to true, then true to false on the 2nd call.
            testState.connection.isReconnectionPaused = !testState.connection.isReconnectionPaused
            func(cb)
          }
        })
        ReWireModule.__Rewire__('resetState', () => {
          // testState.connection.isConnectedToAugurNode = false
          testState.connection.isConnected = false
          return ACTIONS.RESET_STATE
        })
        testStore.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(testStore.getActions(), [
          ACTIONS.STOP_BLOCK_LISTENERS,
          ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS,
          ACTIONS.START_BLOCK_LISTENERS,
          ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.NODES_AUGUR_ON_SET,
          ACTIONS.NODES_ETHEREUM_ON_SET,
          ACTIONS.RESET_STATE,
          ACTIONS.UPDATE_AUGUR_NODE_CONNECTION_STATUS,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.CONNECT_AUGUR,
        ], `Didn't recieve the expected actions`)
        done()
      },
    })

    test({
      description: 'it should handle calling connectAugur more than once if there is an error the first time',
      assertions: (done) => {
        let connectAugurCallCount = 0
        const testState = Object.assign({}, state, {
          connection: {
            ...state.connection,
            isConnected: true,
            isConnectedToAugurNode: true,
            isReconnectionPaused: false,
          },
        })
        const testStore = mockStore.mockStore(testState)
        const ACTIONS = {
          STOP_BLOCK_LISTENERS: { type: 'STOP_BLOCK_LISTENERS' },
          STOP_AUGUR_NODE_EVENT_LISTENERS: { type: 'STOP_AUGUR_NODE_EVENT_LISTENERS' },
          STOP_BLOCKCHAIN_EVENT_LISTENERS: { type: 'STOP_BLOCKCHAIN_EVENT_LISTENERS' },
          START_BLOCK_LISTENERS: { type: 'START_BLOCK_LISTENERS' },
          START_AUGUR_NODE_EVENT_LISTENERS: { type: 'START_AUGUR_NODE_EVENT_LISTENERS' },
          NODES_AUGUR_ON_SET: { type: 'NODES_AUGUR_ON_SET' },
          RESET_STATE: { type: 'RESET_STATE' },
          UPDATE_CONNECTION_STATUS: {
            type: 'UPDATE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_AUGUR_NODE_CONNECTION_STATUS: {
            type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS',
            isConnected: true,
          },
          UPDATE_MODAL: {
            type: 'UPDATE_MODAL',
            data: {
              type: 'MODAL_NETWORK_DISCONNECTED',
              connection: testState.connection,
              env: testState.env,
            },
          },
          NODES_ETHEREUM_ON_SET: { type: 'NODES_ETHEREUM_ON_SET' },
          CONNECT_AUGUR: { type: 'CONNECT_AUGUR' },
        }

        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCK_LISTENERS),
            stopAugurNodeEventListeners: () => testStore.dispatch(ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS),
            stopBlockchainEventListeners: () => testStore.dispatch(ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS),
            startBlockListeners: (args) => {
              testStore.dispatch(ACTIONS.START_BLOCK_LISTENERS)
            },
            startAugurNodeEventListeners: (args) => {
              testStore.dispatch(ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS)
            },
            nodes: {
              augur: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_AUGUR_ON_SET)
                  func()
                },
              },
              ethereum: {
                on: (label, func) => {
                  testStore.dispatch(ACTIONS.NODES_ETHEREUM_ON_SET)
                },
              },
            },
          },
        })
        ReWireModule.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => {
          connectAugurCallCount += 1
          assert.deepEqual(history, mockHistory)
          assert.isFalse(isInitialConnection)
          assert.deepEqual(env, testStore.getState().env)
          // fail the first 3 attempts and then finally pass empty cb.
          if (connectAugurCallCount > 3) {
            cb()
          } else {
            cb({ error: 'some error', message: 'unable to connect' })
          }
          // just to confirm this is actually called.
          return ACTIONS.CONNECT_AUGUR
        })
        ReWireModule.__Rewire__('debounce', (func, wait) => {
          assert.deepEqual(wait, 3000)
          assert.isFunction(func)
          return func
        })
        ReWireModule.__Rewire__('resetState', () => {
          testState.connection.isConnectedToAugurNode = false
          // testState.connection.isConnected = false
          return ACTIONS.RESET_STATE
        })
        testStore.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(testStore.getActions(), [
          ACTIONS.STOP_BLOCK_LISTENERS,
          ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.STOP_BLOCKCHAIN_EVENT_LISTENERS,
          ACTIONS.START_BLOCK_LISTENERS,
          ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS,
          ACTIONS.NODES_AUGUR_ON_SET,
          ACTIONS.RESET_STATE,
          ACTIONS.UPDATE_CONNECTION_STATUS,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.UPDATE_MODAL,
          ACTIONS.CONNECT_AUGUR,
          ACTIONS.CONNECT_AUGUR,
          ACTIONS.CONNECT_AUGUR,
          ACTIONS.CONNECT_AUGUR,
          ACTIONS.NODES_ETHEREUM_ON_SET,
        ], `Didn't recieve the expected actions`)
        done()
      },
    })

    test({
      description: 'it should handle calling market state change',
      assertions: (done) => {
        const testState = Object.assign({}, state, {
          connection: {
            ...state.connection,
            isConnected: true,
            isConnectedToAugurNode: true,
            isReconnectionPaused: false,
          },
        })
        const testStore = mockStore.mockStore(testState)
        const ACTIONS = {
          LOAD_MARKETS_INFO: { type: 'LOAD_MARKETS_INFO' },
        }

        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => { },
            stopAugurNodeEventListeners: () => { },
            stopBlockchainEventListeners: () => { },
            startBlockListeners: (args) => { },
            startAugurNodeEventListeners: (args) => {
              args.MarketState(null, { log: { marketId: 'marketId' } })
            },
            nodes: {
              augur: {
                on: (label, func) => { },
              },
              ethereum: {
                on: (label, func) => { },
              },
            },
          },
        })
        ReWireModule.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => { })
        ReWireModule.__Rewire__('debounce', (func, wait) => { })
        ReWireModule.__Rewire__('resetState', () => { })
        ReWireModule.__Rewire__('loadMarketsInfo', () => ACTIONS.LOAD_MARKETS_INFO)

        testStore.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(testStore.getActions(), [
          ACTIONS.LOAD_MARKETS_INFO,
        ], `Didn't recieve the expected actions`)
        done()
      },
    })


    test({
      description: 'it should handle calling initial report not designated reporter',
      assertions: (done) => {
        const testState = Object.assign({}, state, {
          connection: {
            ...state.connection,
            isConnected: true,
            isConnectedToAugurNode: true,
            isReconnectionPaused: false,
          },
        })
        const testStore = mockStore.mockStore(testState)
        const ACTIONS = {
          LOAD_MARKETS_INFO: { type: 'LOAD_MARKETS_INFO' },
        }

        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => { },
            stopAugurNodeEventListeners: () => { },
            stopBlockchainEventListeners: () => { },
            startBlockListeners: (args) => { },
            startAugurNodeEventListeners: (args) => {
              args.InitialReportSubmitted(null, { log: { marketId: 'marketId' }, reporter: 'bob' })
            },
            nodes: {
              augur: {
                on: (label, func) => { },
              },
              ethereum: {
                on: (label, func) => { },
              },
            },
          },
        })
        ReWireModule.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => { })
        ReWireModule.__Rewire__('debounce', (func, wait) => { })
        ReWireModule.__Rewire__('resetState', () => { })
        ReWireModule.__Rewire__('loadMarketsInfo', () => ACTIONS.LOAD_MARKETS_INFO)

        testStore.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(testStore.getActions(), [
          ACTIONS.LOAD_MARKETS_INFO,
        ], `Didn't recieve the expected actions`)
        done()
      },
    })


    test({
      description: 'it should handle calling initial report IS designated reporter',
      assertions: (done) => {
        const testState = Object.assign({}, state, {
          connection: {
            ...state.connection,
            isConnected: true,
            isConnectedToAugurNode: true,
            isReconnectionPaused: false,
          },
        })
        const testStore = mockStore.mockStore(testState)
        const ACTIONS = {
          LOAD_MARKETS_INFO: { type: 'LOAD_MARKETS_INFO' },
          UPDATE_ASSETS: { type: 'UPDATE_ASSETS' },
        }

        ReWireModule.__Rewire__('augur', {
          events: {
            stopBlockListeners: () => { },
            stopAugurNodeEventListeners: () => { },
            stopBlockchainEventListeners: () => { },
            startBlockListeners: (args) => { },
            startAugurNodeEventListeners: (args) => {
              args.InitialReportSubmitted(null, { log: { marketId: 'marketId' }, reporter: '0x0000000000000000000000000000000000000001' })
            },
            nodes: {
              augur: {
                on: (label, func) => { },
              },
              ethereum: {
                on: (label, func) => { },
              },
            },
          },
        })
        ReWireModule.__Rewire__('connectAugur', (history, env, isInitialConnection, cb) => { })
        ReWireModule.__Rewire__('debounce', (func, wait) => { })
        ReWireModule.__Rewire__('loadMarketsInfo', () => ACTIONS.LOAD_MARKETS_INFO)
        ReWireModule.__Rewire__('updateAssets', () => ACTIONS.UPDATE_ASSETS)

        testStore.dispatch(listenToUpdates(mockHistory))
        assert.deepEqual(testStore.getActions(), [
          ACTIONS.LOAD_MARKETS_INFO,
          ACTIONS.UPDATE_ASSETS,
        ], `Didn't recieve the expected actions`)
        done()
      },
    })


  })
})
