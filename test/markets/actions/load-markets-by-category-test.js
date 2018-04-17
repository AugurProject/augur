import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe('modules/markets/actions/load-markets-by-category.js', () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const test = (t) => {
    it(t.description, () => {
      const state = Object.assign({}, testState)
      const store = mockStore(state)
      const AugurJS = {
        augur: {
          markets: { getMarkets: () => {} },
        },
      }

      const mockLoadMarketsInfo = {}

      mockLoadMarketsInfo.loadMarketsInfoIfNotLoaded = sinon.stub().returns(() => {})

      AugurJS.augur.markets.getMarkets = sinon.stub()
      if (t.toTest === 'err') AugurJS.augur.markets.getMarkets.yields('failed with err', null)
      if (t.toTest === 'null-markets') AugurJS.augur.markets.getMarkets.yields(null, null)
      if (t.toTest === 'array') AugurJS.augur.markets.getMarkets.yields(null, ['0x1, 0x2'])
      if (t.toTest === 'empty-array') AugurJS.augur.markets.getMarkets.yields(null, [])

      const action = proxyquire('../../../src/modules/markets/actions/load-markets-by-category', {
        '../../../services/augurjs': AugurJS,
        './load-markets-info-if-not-loaded': mockLoadMarketsInfo,
      })

      store.dispatch(action.loadMarketsByCategory())

      t.assertions(store.getActions(), mockLoadMarketsInfo.loadMarketsInfoIfNotLoaded)
    })
  }

  test({
    description: 'should dispatch the expected actions on err',
    toTest: 'err',
    assertions: (actions) => {
      const expected = [
        {
          type: 'UPDATE_HAS_LOADED_CATEGORY',
          hasLoadedCategory: { 'fail-err': true },
        },
        {
          type: 'UPDATE_HAS_LOADED_CATEGORY',
          hasLoadedCategory: { 'fail-err': false },
        },
      ]

      assert(actions, expected, 'error was not handled as expected')
    },
  })

  test({
    description: 'should dispatch the expected actions with no error + no marketIds returned',
    toTest: 'null-markets',
    assertions: (actions) => {
      const expected = [
        {
          type: 'UPDATE_HAS_LOADED_CATEGORY',
          hasLoadedCategory: { 'fail-err': true },
        },
        {
          type: 'UPDATE_HAS_LOADED_CATEGORY',
          hasLoadedCategory: { 'fail-err': false },
        },
      ]

      assert(actions, expected, 'error was not handled as expected')
    },
  })

  test({
    description: 'should dispatch the expected actions with no error + array of returned marketIds',
    toTest: 'array',
    assertions: (actions, loadMarketsInfoIfNotLoaded) => {
      const expected = [
        {
          type: 'UPDATE_HAS_LOADED_CATEGORY',
          hasLoadedCategory: { 'fail-err': true },
        },
      ]

      assert(actions, expected, 'returned array was not handled as expected')
      assert.isTrue(loadMarketsInfoIfNotLoaded.calledOnce)
    },
  })

  test({
    description: 'should dispatch the expected actions with no error + an empty array of marketIds',
    toTest: 'empty-array',
    assertions: (actions, loadMarketsInfoIfNotLoaded) => {
      const expected = [
        {
          type: 'UPDATE_HAS_LOADED_CATEGORY',
          hasLoadedCategory: { 'fail-err': true },
        },
      ]

      assert(actions, expected, 'empty array was not handled as expected')
      assert.isFalse(loadMarketsInfoIfNotLoaded.called)
    },
  })
})
