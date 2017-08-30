import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

import { UPDATE_MARKETS_DATA } from 'modules/markets/actions/update-markets-data'
import { UPDATE_HAS_LOADED_MARKETS } from 'modules/markets/actions/update-has-loaded-markets'

describe(`modules/markets/actions/load-markets.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const state = Object.assign({}, testState)

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(state)
      const AugurJS = {
        augur: { markets: {} }
      }

      AugurJS.augur.markets.loadMarkets = sinon.stub()

      if (t.toTest === 'err') AugurJS.augur.markets.loadMarkets.yields('fails', null)
      if (t.toTest === 'null-markets-data') AugurJS.augur.markets.loadMarkets.yields(null, null)
      if (t.toTest === 'object') AugurJS.augur.markets.loadMarkets.yields(null, { test: 'test' })
      if (t.toTest === 'empty-object') AugurJS.augur.markets.loadMarkets.yields(null, {})

      const action = proxyquire('../../../src/modules/markets/actions/load-markets', {
        '../../../services/augurjs': AugurJS
      })

      store.dispatch(action.loadMarkets())

      t.assertions(store.getActions())
    })
  }

  test({
    description: 'should dispatch the expected actions of err',
    toTest: 'err',
    assertions: (actions) => {
      const expected = [
        {
          type: UPDATE_HAS_LOADED_MARKETS,
          hasLoadedMarkets: true
        },
        {
          type: UPDATE_HAS_LOADED_MARKETS,
          hasLoadedMarkets: false
        }
      ]

      assert.deepEqual(actions, expected, 'error was not handled as expected')
    }
  })

  test({
    description: 'should dispatch the expected actions with no error + no marketsData returned',
    toTest: 'null-markets-data',
    assertions: (actions) => {
      const expected = [
        {
          type: UPDATE_HAS_LOADED_MARKETS,
          hasLoadedMarkets: true
        },
        {
          type: UPDATE_HAS_LOADED_MARKETS,
          hasLoadedMarkets: false
        }
      ]

      // console.log('actions -- ', actions);
      assert.deepEqual(actions, expected, 'error was not handled as expected')
    }
  })

  test({
    description: 'should dispatch the expected actions with no error + object of returned marketsData',
    toTest: 'object',
    assertions: (actions) => {
      const expected = [
        {
          type: UPDATE_HAS_LOADED_MARKETS,
          hasLoadedMarkets: true
        },
        {
          type: UPDATE_MARKETS_DATA,
          marketsData: {
            test: 'test'
          }
        }
      ]

      assert.deepEqual(actions, expected, 'returned object was not handled as expected')
    }
  })

  test({
    description: 'should dispatch the expected actions with no error + an empty object of marketsData',
    toTest: 'empty-object',
    assertions: (actions) => {
      const expected = [
        {
          type: UPDATE_HAS_LOADED_MARKETS,
          hasLoadedMarkets: true
        }
      ]

      assert.deepEqual(actions, expected, 'returned object was not handled as expected')
    }
  })
})
