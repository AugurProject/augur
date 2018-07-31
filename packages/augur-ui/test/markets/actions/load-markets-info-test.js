

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import sinon from 'sinon'

import { loadMarketsInfo, __RewireAPI__ } from 'modules/markets/actions/load-markets-info'

import { MARKET_INFO_LOADING, MARKET_INFO_LOADED } from 'modules/market/constants/market-loading-states'
import { UPDATE_MARKET_LOADING, REMOVE_MARKET_LOADING } from 'modules/market/actions/update-market-loading'
import { UPDATE_MARKETS_DATA } from 'modules/markets/actions/update-markets-data'

describe('modules/markets/actions/load-markets-info.js', () => {
  const middleware = [thunk]
  const mockStore = configureMockStore(middleware)

  const marketIds = ['0xMarket1', '0xMarket2']

  const test = t => it(t.description, (done) => {
    const store = mockStore()

    t.assertions(store, done)
  })

  describe('loadMarketsInfo', () => {
    __RewireAPI__.__Rewire__('updateMarketLoading', marketLoading => ({
      type: UPDATE_MARKET_LOADING,
      data: {
        ...marketLoading,
      },
    }))

    test({
      description: `should dispatch the expected actions + call 'getMarketsInfo'`,
      assertions: (store, done) => {
        const stubbedAugur = {
          markets: {
            getMarketsInfo: sinon.stub(),
          },
        }
        __RewireAPI__.__Rewire__('augur', stubbedAugur)

        store.dispatch(loadMarketsInfo(marketIds))

        const actual = store.getActions()

        const expected = [
          {
            type: 'UPDATE_MARKET_LOADING',
            data: {
              '0xMarket1': 'MARKET_INFO_LOADING',
            },
          },
          {
            type: 'UPDATE_MARKET_LOADING',
            data: {
              '0xMarket2': 'MARKET_INFO_LOADING',
            },
          },
        ]

        assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
        assert.isTrue(stubbedAugur.markets.getMarketsInfo.calledOnce, `didn't call 'getMarketsInfo' once as expected`)

        __RewireAPI__.__ResetDependency__('augur')

        done()
      },
    })

    test({
      description: `should dispatch the expected actions + call 'loadingError' due to error returned from 'getMarketsInfo'`,
      assertions: (store, done) => {
        const stubbedAugur = {
          markets: {
            getMarketsInfo: (marketIds, cb) => cb(true),
          },
        }
        __RewireAPI__.__Rewire__('augur', stubbedAugur)

        const stubbedLoadingError = sinon.stub()
        __RewireAPI__.__Rewire__('loadingError', stubbedLoadingError)

        store.dispatch(loadMarketsInfo(marketIds))

        const actual = store.getActions()

        const expected = [
          {
            type: 'UPDATE_MARKET_LOADING',
            data: {
              '0xMarket1': 'MARKET_INFO_LOADING',
            },
          },
          {
            type: 'UPDATE_MARKET_LOADING',
            data: {
              '0xMarket2': 'MARKET_INFO_LOADING',
            },
          },
        ]

        assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
        assert.isTrue(stubbedLoadingError.calledOnce, `didn't call 'loadingError' once as expected`)

        __RewireAPI__.__ResetDependency__('augur')
        __RewireAPI__.__ResetDependency__('loadingError')

        done()
      },
    })

    test({
      description: `should dispatch the expected actions + call 'loadingError' due to null return value from 'getMarketsInfo'`,
      assertions: (store, done) => {
        const stubbedAugur = {
          markets: {
            getMarketsInfo: (marketIds, cb) => cb(null, []),
          },
        }
        __RewireAPI__.__Rewire__('augur', stubbedAugur)

        const stubbedLoadingError = sinon.stub()
        __RewireAPI__.__Rewire__('loadingError', stubbedLoadingError)

        store.dispatch(loadMarketsInfo(marketIds))

        const actual = store.getActions()

        const expected = [
          {
            type: 'UPDATE_MARKET_LOADING',
            data: {
              '0xMarket1': 'MARKET_INFO_LOADING',
            },
          },
          {
            type: 'UPDATE_MARKET_LOADING',
            data: {
              '0xMarket2': 'MARKET_INFO_LOADING',
            },
          },
        ]

        assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
        assert.isTrue(stubbedLoadingError.calledOnce, `didn't call 'loadingError' once as expected`)

        __RewireAPI__.__ResetDependency__('augur')
        __RewireAPI__.__ResetDependency__('loadingError')

        done()
      },
    })

    test({
      description: `should dispatch the expected actions + call 'loadingError' due to malformed return value from 'getMarketsInfo'`,
      assertions: (store, done) => {
        const stubbedAugur = {
          markets: {
            getMarketsInfo: (marketIds, cb) => cb(null, [{ mal: 'formed' }]),
          },
        }
        __RewireAPI__.__Rewire__('augur', stubbedAugur)

        const stubbedLoadingError = sinon.stub()
        __RewireAPI__.__Rewire__('loadingError', stubbedLoadingError)

        store.dispatch(loadMarketsInfo(marketIds))

        const actual = store.getActions()

        const expected = [
          {
            type: 'UPDATE_MARKET_LOADING',
            data: {
              '0xMarket1': 'MARKET_INFO_LOADING',
            },
          },
          {
            type: 'UPDATE_MARKET_LOADING',
            data: {
              '0xMarket2': 'MARKET_INFO_LOADING',
            },
          },
        ]

        assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
        assert.isTrue(stubbedLoadingError.calledOnce, `didn't call 'loadingError' once as expected`)

        __RewireAPI__.__ResetDependency__('augur')
        __RewireAPI__.__ResetDependency__('loadingError')

        done()
      },
    })

    test({
      description: `should dispatch the expected actions`,
      assertions: (store, done) => {
        const stubbedAugur = {
          markets: {
            getMarketsInfo: (marketIds, cb) => cb(false, marketIds.marketIds.reduce((p, marketId) => ([...p, { id: marketId, test: 'value' }]), [])),
          },
        }
        __RewireAPI__.__Rewire__('augur', stubbedAugur)

        store.dispatch(loadMarketsInfo(marketIds))

        const actual = store.getActions()

        const expected = [
          {
            type: UPDATE_MARKET_LOADING,
            data: {
              '0xMarket1': MARKET_INFO_LOADING,
            },
          },
          {
            type: UPDATE_MARKET_LOADING,
            data: {
              '0xMarket2': MARKET_INFO_LOADING,
            },
          },
          {
            type: UPDATE_MARKET_LOADING,
            data: {
              '0xMarket1': MARKET_INFO_LOADED,
            },
          },
          {
            type: UPDATE_MARKET_LOADING,
            data: {
              '0xMarket2': MARKET_INFO_LOADED,
            },
          },
          {
            type: UPDATE_MARKETS_DATA,
            marketsData: {
              '0xMarket1': {
                id: '0xMarket1',
                test: 'value',
              },
              '0xMarket2': {
                id: '0xMarket2',
                test: 'value',
              },
            },
          },
        ]

        assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)

        __RewireAPI__.__ResetDependency__('augur')
        __RewireAPI__.__ResetDependency__('loadingError')

        done()
      },
    })

  })

  describe('loadingError', () => {
    __RewireAPI__.__Rewire__('removeMarketLoading', marketId => ({
      type: REMOVE_MARKET_LOADING,
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

        loadingError(store.dispatch, callback, 'ERROR', marketIds)

        const actual = store.getActions()

        const expected = [
          {
            type: 'REMOVE_MARKET_LOADING',
            data: {
              marketId: '0xMarket1',
            },
          },
          {
            type: 'REMOVE_MARKET_LOADING',
            data: {
              marketId: '0xMarket2',
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
