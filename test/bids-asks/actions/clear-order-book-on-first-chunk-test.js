

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import clearOrderBookOnFirstChunk from 'modules/bids-asks/actions/clear-order-book-on-first-chunk'

describe(`modules/bids-asks/actions/clear-order-book-on-first-chunk.js`, () => {
  const test = t => it(t.description, () => {
    const store = configureMockStore([thunk])({ ...t.mock.state })
    store.dispatch(clearOrderBookOnFirstChunk(t.params.marketId, t.params.outcome, t.params.orderTypeLabel))
    t.assertions(store.getActions())
    store.clearActions()
  })
  test({
    description: 'first order book chunk not yet loaded: clear order book',
    params: {
      marketId: 'MARKET_0',
      outcome: 2,
      orderTypeLabel: 'buy',
    },
    mock: {
      state: {
        isFirstOrderBookChunkLoaded: {
          MARKET_0: { 2: { buy: false } },
        },
      },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED',
        marketId: 'MARKET_0',
        outcome: 2,
        orderTypeLabel: 'buy',
        isLoaded: true,
      }, {
        type: 'CLEAR_ORDER_BOOK',
        marketId: 'MARKET_0',
        outcome: 2,
        orderTypeLabel: 'buy',
      }])
    },
  })
  test({
    description: 'first order book chunk already loaded: do not clear order book',
    params: {
      marketId: 'MARKET_0',
      outcome: 2,
      orderTypeLabel: 'buy',
    },
    mock: {
      state: {
        isFirstOrderBookChunkLoaded: {
          MARKET_0: { 2: { buy: true } },
          MARKET_1: { 1: { buy: false } },
        },
      },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    },
  })
})
