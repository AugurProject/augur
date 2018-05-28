import { describe, it } from 'mocha'
import mockStore from 'test/mockStore'
import { listenToUpdates, __RewireAPI__ as RewireListenToUpdates } from 'modules/events/actions/listen-to-updates'
import { __RewireAPI__ as RewireLogHandlers } from 'modules/events/actions/log-handlers'

describe('events/actions/listen-to-updates', () => {
  describe('setup shape tests', () => {
    const ACTIONS = {
      STOP_BLOCK_LISTENERS: { type: 'STOP_BLOCK_LISTENERS' },
      STOP_AUGUR_NODE_EVENT_LISTENERS: { type: 'STOP_AUGUR_NODE_EVENT_LISTENERS' },
      START_BLOCK_LISTENERS: { type: 'START_BLOCK_LISTENERS' },
      START_AUGUR_NODE_EVENT_LISTENERS: { type: 'START_AUGUR_NODE_EVENT_LISTENERS' },
      NODES_AUGUR_ON_SET: { type: 'NODES_AUGUR_ON_SET' },
      NODES_ETHEREUM_ON_SET: { type: 'NODES_ETHEREUM_ON_SET' },
    }
    const test = t => it(t.description, () => {
      const store = mockStore.mockStore({})
      RewireListenToUpdates.__Rewire__('augur', {
        events: {
          stopBlockListeners: () => store.dispatch(ACTIONS.STOP_BLOCK_LISTENERS),
          stopAugurNodeEventListeners: () => store.dispatch(ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS),
          startBlockListeners: (listeners) => {
            assert.isFunction(listeners.onAdded, `Didn't pass a function to startBlockListeners.onAdded as expected.`)
            assert.isFunction(listeners.onRemoved, `Didn't pass a function to startBlockListeners.onRemoved as expected.`)
            store.dispatch(ACTIONS.START_BLOCK_LISTENERS)
          },
          startAugurNodeEventListeners: (listeners) => {
            assert.isFunction(listeners.MarketState, `Didn't pass a function to startAugurNodeListeners.MarketState as expected.`)
            assert.isFunction(listeners.InitialReportSubmitted, `Didn't pass a function to startAugurNodeListeners.InitialReportSubmitted as expected.`)
            assert.isFunction(listeners.MarketCreated, `Didn't pass a function to startAugurNodeListeners.MarketCreated as expected.`)
            assert.isFunction(listeners.TokensTransferred, `Didn't pass a function to startAugurNodeListeners.TokensTransferred as expected.`)
            assert.isFunction(listeners.OrderCanceled, `Didn't pass a function to startAugurNodeListeners.OrderCanceled as expected.`)
            assert.isFunction(listeners.OrderCreated, `Didn't pass a function to startAugurNodeListeners.OrderCreated as expected.`)
            assert.isFunction(listeners.OrderFilled, `Didn't pass a function to startAugurNodeListeners.OrderFilled as expected.`)
            assert.isFunction(listeners.TradingProceedsClaimed, `Didn't pass a function to startAugurNodeListeners.TradingProceedsClaimed as expected.`)
            assert.isFunction(listeners.MarketFinalized, `Didn't pass a function to startAugurNodeListeners.MarketFinalized as expected.`)
            assert.isFunction(listeners.UniverseForked, `Didn't pass a function to startAugurNodeListeners.UniverseForked as expected.`)
            assert.isFunction(listeners.FeeWindowCreated, `Didn't pass a function to startAugurNodeListeners.FeeWindowCreated as expected.`)
            store.dispatch(ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS)
          },
          nodes: {
            augur: {
              on: (label, onDisconnect) => {
                assert.strictEqual(label, 'disconnect', `expected the disconnect label to be passed to augur.nodes.augur.on`)
                assert.isFunction(onDisconnect, `Expected augur.nodes.augur.on to have a function passed as the second argument.`)
                store.dispatch(ACTIONS.NODES_AUGUR_ON_SET)
              },
            },
            ethereum: {
              on: (label, onDisconnect) => {
                assert.strictEqual(label, 'disconnect', `expected the disconnect label to be passed to augur.nodes.ethereum.on`)
                assert.isFunction(onDisconnect, `Expected augur.nodes.ethereum.on to have a function passed as the second argument.`)
                store.dispatch(ACTIONS.NODES_ETHEREUM_ON_SET)
              },
            },
          },
        },
      })
      store.dispatch(listenToUpdates({}))
      t.assertions(store.getActions())
    })
    test({
      description: 'it should handle clearing all listeners then setting all listeners when called.',
      assertions: actions => assert.deepEqual(actions, [
        ACTIONS.STOP_BLOCK_LISTENERS,
        ACTIONS.STOP_AUGUR_NODE_EVENT_LISTENERS,
        ACTIONS.START_BLOCK_LISTENERS,
        ACTIONS.START_AUGUR_NODE_EVENT_LISTENERS,
        ACTIONS.NODES_AUGUR_ON_SET,
        ACTIONS.NODES_ETHEREUM_ON_SET,
      ]),
    })
  })
  describe('MarketState', () => {
    const test = t => it(t.description, () => {
      const store = mockStore.mockStore(t.state)
      RewireLogHandlers.__Rewire__('loadMarketsInfo', marketIds => ({ type: 'LOAD_MARKETS_INFO', marketIds }))
      RewireListenToUpdates.__Rewire__('augur', t.stub.augur)
      store.dispatch(listenToUpdates({}))
      t.assertions(store.getActions())
    })
    test({
      description: 'it should handle calling market state change',
      state: {
        universe: { id: 'UNIVERSE_ADDRESS' },
      },
      stub: {
        augur: {
          events: {
            stopBlockListeners: () => {},
            stopAugurNodeEventListeners: () => {},
            startBlockListeners: () => {},
            startAugurNodeEventListeners: listeners => listeners.MarketState(null, { marketId: 'MARKET_ADDRESS', universe: 'UNIVERSE_ADDRESS' }),
            nodes: { augur: { on: () => {} }, ethereum: { on: () => {} } },
          },
        },
      },
      assertions: actions => assert.deepEqual(actions, [{ type: 'LOAD_MARKETS_INFO', marketIds: ['MARKET_ADDRESS'] }]),
    })
  })
  describe('InitialReportSubmitted', () => {
    const test = t => it(t.description, () => {
      const store = mockStore.mockStore(t.state)
      RewireLogHandlers.__Rewire__('loadMarketsInfo', marketIds => ({ type: 'LOAD_MARKETS_INFO', marketIds }))
      RewireLogHandlers.__Rewire__('updateLoggedTransactions', log => ({ type: 'UPDATE_LOGGED_TRANSACTIONS', log }))
      RewireLogHandlers.__Rewire__('updateAssets', () => ({ type: 'UPDATE_ASSETS' }))
      RewireLogHandlers.__Rewire__('loadReporting', () => ({ type: 'LOAD_REPORTING' }))
      RewireListenToUpdates.__Rewire__('augur', t.stub.augur)
      store.dispatch(listenToUpdates({}))
      t.assertions(store.getActions())
    })
    test({
      description: 'it should handle calling initial report not designated reporter',
      state: {
        universe: { id: 'UNIVERSE_ADDRESS' },
        loginAccount: { address: 'MY_ADDRESS' },
      },
      stub: {
        augur: {
          events: {
            stopBlockListeners: () => {},
            stopAugurNodeEventListeners: () => {},
            startBlockListeners: () => {},
            startAugurNodeEventListeners: listeners => listeners.InitialReportSubmitted(null, { eventName: 'InitialReportSubmitted', market: 'MARKET_ADDRESS', reporter: 'REPORTER_ADDRESS', universe: 'UNIVERSE_ADDRESS' }),
            nodes: { augur: { on: () => {} }, ethereum: { on: () => {} } },
          },
        },
      },
      assertions: actions => assert.deepEqual(actions, [{ type: 'LOAD_MARKETS_INFO', marketIds: ['MARKET_ADDRESS'] }]),
    })
    test({
      description: 'it should handle calling initial report IS designated reporter',
      state: {
        universe: { id: 'UNIVERSE_ADDRESS' },
        loginAccount: { address: 'MY_ADDRESS' },
      },
      stub: {
        augur: {
          events: {
            stopBlockListeners: () => {},
            stopAugurNodeEventListeners: () => {},
            startBlockListeners: () => {},
            startAugurNodeEventListeners: listeners => listeners.InitialReportSubmitted(null, { eventName: 'InitialReportSubmitted', market: 'MARKET_ADDRESS', reporter: 'MY_ADDRESS', universe: 'UNIVERSE_ADDRESS' }),
            nodes: { augur: { on: () => {} }, ethereum: { on: () => {} } },
          },
        },
      },
      assertions: actions => assert.deepEqual(actions, [
        { type: 'LOAD_MARKETS_INFO', marketIds: ['MARKET_ADDRESS'] },
        { type: 'LOAD_REPORTING' },
        { type: 'UPDATE_LOGGED_TRANSACTIONS', log: { eventName: 'InitialReportSubmitted', market: 'MARKET_ADDRESS', reporter: 'MY_ADDRESS', universe: 'UNIVERSE_ADDRESS' } },
      ]),
    })
  })
})
