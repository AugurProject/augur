

import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { loadFullMarket, loadMarketDetails, __RewireAPI__ } from 'modules/market/actions/load-full-market'

describe('modules/market/actions/load-full-market.js', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const MOCK_ACTION_TYPES = {
    MARKET_FULLY_LOADING: 'MARKET_FULLY_LOADING',
    MARKET_FULLY_LOADED: 'MARKET_FULLY_LOADED',
    REMOVE_MARKET_LOADING: 'REMOVE_MARKET_LOADING',
    LOAD_MARKET_DETAILS: 'LOAD_MARKET_DETAILS',
    LOAD_MARKETS_INFO: 'LOAD_MARKETS_INFO',
    LOAD_BIDS_ASKS: 'LOAD_BIDS_ASKS',
    LOAD_ACCOUNT_TRADES: 'LOAD_ACCOUNT_TRADES',
    LOAD_PRICE_HISTORY: 'LOAD_PRICE_HISTORY',
  }

  const test = t => it(t.description, (done) => {
    const store = mockStore(t.state || {})

    t.assertions(store, done)
  })

  describe('loadFullMarket', () => {
    __RewireAPI__.__Rewire__('updateMarketLoading', () => ({
      type: MOCK_ACTION_TYPES.MARKET_FULLY_LOADING,
    }))
    __RewireAPI__.__Rewire__('loadMarketDetails', marketId => ({
      type: MOCK_ACTION_TYPES.LOAD_MARKET_DETAILS,
      data: {
        marketId,
      },
    }))

    afterEach(() => {
      __RewireAPI__.__ResetDependency__('loadMarketsInfo')
    })

    after(() => {
      __RewireAPI__.__ResetDependency__('updateMarketLoading')
      __RewireAPI__.__ResetDependency__('loadMarketDetails')
    })

    test({
      description: `should dispatch the expected actions when basic market data IS NOT loaded and info loads WITHOUT errors`,
      state: {
        marketsData: {},
      },
      assertions: (store, done) => {
        __RewireAPI__.__Rewire__('loadMarketsInfo', (marketIds, cb) => {
          cb()
          return {
            type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO,
            data: {
              marketIds,
            },
          }
        })

        store.dispatch(loadFullMarket('0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.MARKET_FULLY_LOADING,
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

        __RewireAPI__.__ResetDependency__('loadMarketsInfo')

        done()
      },
    })

    test({
      description: `should dispatch the expected actions when basic market data IS NOT loaded and info loads WITH errors`,
      state: {
        marketsData: {},
      },
      assertions: (store, done) => {
        const stubbedLoadingError = sinon.stub()
        __RewireAPI__.__Rewire__('loadingError', stubbedLoadingError)

        __RewireAPI__.__Rewire__('loadMarketsInfo', (marketIds, cb) => {
          cb(true)
          return {
            type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO,
            data: {
              marketIds,
            },
          }
        })

        store.dispatch(loadFullMarket('0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.MARKET_FULLY_LOADING,
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
        assert.isTrue(stubbedLoadingError.calledOnce, `didn't call 'loadingError' once as expected`)

        __RewireAPI__.__ResetDependency__('loadMarketsInfo')

        done()
      },
    })

    test({
      description: `should dispatch the expected actions when basic market data IS loaded`,
      state: {
        marketsData: {
          '0xMARKETID': {},
        },
      },
      assertions: (store, done) => {
        __RewireAPI__.__Rewire__('loadMarketsInfo', (marketIds, cb) => {
          cb()
          return {
            type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO,
            data: {
              marketIds,
            },
          }
        })

        store.dispatch(loadFullMarket('0xMARKETID'))
        const actual = store.getActions()
        const expected = [
          {
            type: MOCK_ACTION_TYPES.MARKET_FULLY_LOADING,
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_DETAILS,
            data: {
              marketId: '0xMARKETID',
            },
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)

        __RewireAPI__.__ResetDependency__('loadMarketsInfo')

        done()
      },
    })
  })

  describe('loadMarketsDetails', () => {

    afterEach(() => {
      __RewireAPI__.__ResetDependency__('loadBidsAsks')
      __RewireAPI__.__ResetDependency__('loadAccountTrades')
      __RewireAPI__.__ResetDependency__('loadPriceHistory')
      __RewireAPI__.__ResetDependency__('updateMarketLoading')
      __RewireAPI__.__ResetDependency__('loadingError')
    })

    test({
      description: 'should dispatch the expected actions WITHOUT chained errors',
      assertions: (store, done) => {
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
        __RewireAPI__.__Rewire__('updateMarketLoading', data => ({
          type: MOCK_ACTION_TYPES.MARKET_FULLY_LOADED,
          data,
        }))

        store.dispatch(loadMarketDetails('0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.MARKET_FULLY_LOADED,
            data: {
              '0xMARKETID': MOCK_ACTION_TYPES.MARKET_FULLY_LOADED,
            },
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_PRICE_HISTORY,
            data: {
              marketId: {
                marketId: '0xMARKETID',
              },
            },
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
            data: {
              marketId: '0xMARKETID',
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

        done()
      },
    })

    test({
      description: 'should dispatch the expected actions WITH error returned from `loadBidsAsks`',
      assertions: (store, done) => {
        const stubbedLoadingError = sinon.stub()
        __RewireAPI__.__Rewire__('loadingError', stubbedLoadingError)

        __RewireAPI__.__Rewire__('loadBidsAsks', (marketId, cb) => {
          cb(true)
          return {
            type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS,
            data: {
              marketId,
            },
          }
        })

        store.dispatch(loadMarketDetails('0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS,
            data: {
              marketId: '0xMARKETID',
            },
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
        assert.isTrue(stubbedLoadingError.calledOnce, `didn't call 'loadingError' once as expected`)

        done()
      },
    })
    test({
      description: 'should dispatch the expected actions WITH error returned from `loadAccountTrades`',
      assertions: (store, done) => {
        const stubbedLoadingError = sinon.stub()
        __RewireAPI__.__Rewire__('loadingError', stubbedLoadingError)

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
          cb(true)
          return {
            type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
            data: {
              ...options,
            },
          }
        })

        store.dispatch(loadMarketDetails('0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
            data: {
              marketId: '0xMARKETID',
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
        assert.isTrue(stubbedLoadingError.calledOnce, `didn't call 'loadingError' once as expected`)

        done()
      },
    })

    test({
      description: 'should dispatch the expected actions WITH error returned from `loadPriceHistory`',
      assertions: (store, done) => {
        const stubbedLoadingError = sinon.stub()
        __RewireAPI__.__Rewire__('loadingError', stubbedLoadingError)

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
          cb(true)
          return {
            type: MOCK_ACTION_TYPES.LOAD_PRICE_HISTORY,
            data: {
              marketId,
            },
          }
        })

        store.dispatch(loadMarketDetails('0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_PRICE_HISTORY,
            data: {
              marketId: {
                marketId: '0xMARKETID',
              },
            },
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
            data: {
              marketId: '0xMARKETID',
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
        assert.isTrue(stubbedLoadingError.calledOnce, `didn't call 'loadingError' once as expected`)

        done()
      },
    })
  })

  describe('loadingError', () => {
    __RewireAPI__.__Rewire__('removeMarketLoading', marketId => ({
      type: MOCK_ACTION_TYPES.REMOVE_MARKET_LOADING,
      data: {
        marketId,
      },
    }))

    after(() => {
      __RewireAPI__.__ResetDependency__('removeMarketLoading')
    })

    const loadingError = __RewireAPI__.__get__('loadingError')

    test({
      description: 'should remove the market from the loading state + call the callback with error parameter',
      assertions: (store, done) => {
        let callbackReturnValue

        const callback = (err) => {
          callbackReturnValue = err
        }

        loadingError(store.dispatch, callback, 'ERROR', '0xtest')

        const actual = store.getActions()

        const expected = [
          {
            type: 'REMOVE_MARKET_LOADING',
            data: {
              marketId: '0xtest',
            },
          },
        ]

        assert.deepEqual(actual, expected, `didn't return the expected values`)
        assert.equal('ERROR', callbackReturnValue, `didn't return the expected value`)

        done()
      },
    })
  })
})
