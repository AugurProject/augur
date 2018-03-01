import { describe, it } from 'mocha'
import { assert } from 'chai'

import marketLoading from 'modules/market/reducers/market-loading'

import { ADD_MARKET_LOADING, REMOVE_MARKET_LOADING } from 'modules/market/actions/update-market-loading'

describe('modules/market/reducers/market-loading', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: 'should return the default state, existing state undefined',
    assertions: () => {
      const actual = marketLoading(undefined, {
        type: null,
      })

      const expected = []

      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })

  test({
    description: 'should return the existing state, existing state defined',
    assertions: () => {
      const actual = marketLoading(['testing'], {
        type: null,
      })

      const expected = ['testing']

      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })

  test({
    description: 'should return the expected array for case ADD_MARKET_LOADING',
    assertions: () => {
      const actual = marketLoading([], {
        type: ADD_MARKET_LOADING,
        data: {
          marketId: '0xMARKETID',
        },
      })

      const expected = ['0xMARKETID']

      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })

  test({
    description: 'should return the expected array for case REMOVE_MARKET_LOADING',
    assertions: () => {
      const actual = marketLoading(['0xMARKETID1', '0xMARKETID2'], {
        type: REMOVE_MARKET_LOADING,
        data: {
          marketId: '0xMARKETID1',
        },
      })

      const expected = ['0xMARKETID2']

      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })
})
