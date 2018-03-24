

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

describe('modules/markets/actions/load-unclaimed-fees.js', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {})

    t.assertions(store)
  })

  describe('loadUnclaimedFees', () => {
    const { loadUnclaimedFees, __RewireAPI__ } = require('modules/markets/actions/load-unclaimed-fees')

    const ACTIONS = {
      UPDATE_MARKETS_DATA: 'UPDATE_MARKETS_DATA',
    }

    __RewireAPI__.__Rewire__('augur', {
      augurNode: {
        submitRequest: (label, p, cb) => {
          assert.deepEqual(label, 'getUnclaimedMarketCreatorFees', `Didn't call the correct getter function from augurNode`)
          if (!p.marketIds) return cb({ error: 'must include marketIds parameter' })
          if (p.marketIds.length === 0) return cb(null, {})
          cb(null, { '0xabc1': 0, '0xabc2': 0, '0xabc3': 0 })
        },
      },
    })
    __RewireAPI__.__Rewire__('updateMarketsData', marketsData => ({
      type: ACTIONS.UPDATE_MARKETS_DATA,
      data: {
        marketsData,
      },
    }))

    test({
      description: `should dispatch the expected actions when no user markets are passed`,
      state: {
        marketsData: {},
      },
      assertions: (store) => {
        // use default MarketIds, which is []
        store.dispatch(loadUnclaimedFees(undefined, (err, unclaimedFees) => {
          assert.isNull(err, `Didn't return null for error as expected`)
          assert.deepEqual(unclaimedFees, {}, `Expected unclaimedFees to be an empty object`)
        }))

        const actual = store.getActions()

        const expected = [{
          type: ACTIONS.UPDATE_MARKETS_DATA,
          data: {
            marketsData: {},
          },
        }]

        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`)
      },
    })

    test({
      description: `should handle errors from getUnclaimedMarketCreatorFees`,
      state: {
        marketsData: {},
      },
      assertions: (store) => {
        // force an error
        store.dispatch(loadUnclaimedFees(null, (err, unclaimedFees) => {
          const expectedError = { error: 'must include marketIds parameter' }

          assert.deepEqual(err, expectedError, `Didn't return the expected error`)
          assert.isUndefined(unclaimedFees, `Expected unclaimedFees to be an empty object`)
        }))

        const actual = store.getActions()

        const expected = []

        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`)
      },
    })

    test({
      description: `should handle an error due to missing data`,
      state: {
        marketsData: {},
      },
      assertions: (store) => {
        store.dispatch(loadUnclaimedFees(['0xabc1', '0xabc2', '0xabc3'], (err, unclaimedFees) => {
          const expectedUnclaimedFees = {
            '0xabc1': 0,
            '0xabc2': 0,
            '0xabc3': 0,
          }

          assert.isNull(err, `Didn't return null for error as expected`)
          assert.deepEqual(unclaimedFees, expectedUnclaimedFees, `Unexpected unclaimed Fees Object`)
        }))

        const actual = store.getActions()

        const expected = [{
          type: ACTIONS.UPDATE_MARKETS_DATA,
          data: {
            marketsData: {
              '0xabc1': { unclaimedCreatorFees: 0 },
              '0xabc2': { unclaimedCreatorFees: 0 },
              '0xabc3': { unclaimedCreatorFees: 0 },
            },
          },
        }]

        assert.deepEqual(actual, expected, `Dispatched unexpected Actions.`)
      },
    })
  })
})
