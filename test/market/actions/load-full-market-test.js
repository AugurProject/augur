import { describe, it } from 'mocha'
import { assert } from 'chai'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

describe('modules/market/actions/load-full-market.js', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const MOCK_ACTION_TYPES = {
    ADD_MARKET_LOADING: 'ADD_MARKET_LOADING',
    REMOVE_MARKET_LOADING: 'REMOVE_MARKET_LOADING',
    LOAD_MARKET_DETAILS: 'LOAD_MARKET_DETAILS',
    LOAD_MARKETS_INFO: 'LOAD_MARKETS_INFO',
    LOAD_BIDS_ASKS: 'LOAD_BIDS_ASKS',
    LOAD_ACCOUNT_TRADES: 'LOAD_ACCOUNT_TRADES',
    LOAD_PRICE_HISTORY: 'LOAD_PRICE_HISTORY',
  }

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {})

    t.assertions(store)
  })

  describe('loadFullMarket', () => {
    const { loadFullMarket, __RewireAPI__ } = require('modules/market/actions/load-full-market')

    __RewireAPI__.__Rewire__('addMarketLoading', () => ({
      type: MOCK_ACTION_TYPES.ADD_MARKET_LOADING,
    }))
    __RewireAPI__.__Rewire__('loadMarketsInfo', (marketIds, cb) => {
      cb()
      return {
        type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO,
        data: {
          marketIds,
        },
      }
    })
    __RewireAPI__.__Rewire__('loadMarketDetails', marketId => ({
      type: MOCK_ACTION_TYPES.LOAD_MARKET_DETAILS,
      data: {
        marketId,
      },
    }))

    test({
      description: `should dispatch the expected actions when basic market data IS NOT loaded`,
      state: {
        marketsData: {},
      },
      assertions: (store) => {
        store.dispatch(loadFullMarket('0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.ADD_MARKET_LOADING,
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_DETAILS,
            data: {
              marketId: '0xMARKETID',
            },
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO,
            data: {
              marketIds: [
                '0xMARKETID',
              ],
            },
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })

    test({
      description: `should dispatch the expected actions when basic market data IS loaded`,
      state: {
        marketsData: {
          '0xMARKETID': {},
        },
      },
      assertions: (store) => {
        store.dispatch(loadFullMarket('0xMARKETID'))
        const actual = store.getActions()
        const expected = [
          {
            type: MOCK_ACTION_TYPES.ADD_MARKET_LOADING,
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_DETAILS,
            data: {
              marketId: '0xMARKETID',
            },
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })
  })

  describe('loadMarketsDetails', () => {
    const { loadMarketDetails, __RewireAPI__ } = require('modules/market/actions/load-full-market')

    __RewireAPI__.__Rewire__('loadBidsAsks', (marketId, cb) => {
      cb()
      return {
        type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS,
        data: {
          marketId,
        },
      }
    })
    __RewireAPI__.__Rewire__('loadAccountTrades', (options, cb) => {
      cb()
      return {
        type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
        data: {
          ...options,
        },
      }
    })
    __RewireAPI__.__Rewire__('loadPriceHistory', (marketId, cb) => {
      cb()
      return {
        type: MOCK_ACTION_TYPES.LOAD_PRICE_HISTORY,
        data: {
          marketId,
        },
      }
    })
    __RewireAPI__.__Rewire__('removeMarketLoading', marketId => ({
      type: MOCK_ACTION_TYPES.REMOVE_MARKET_LOADING,
      data: {
        marketId,
      },
    }))

    test({
      description: 'should dispatch the expected actions',
      assertions: (store) => {
        store.dispatch(loadMarketDetails('0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.REMOVE_MARKET_LOADING,
            data: {
              marketId: '0xMARKETID',
            },
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_PRICE_HISTORY,
            data: {
              marketId: {
                market: '0xMARKETID',
              },
            },
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
            data: {
              market: '0xMARKETID',
            },
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS,
            data: {
              marketId: '0xMARKETID',
            },
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })
  })
})
