import { describe, it } from 'mocha'
import { assert } from 'chai'

import { ADD_MARKET_LOADING, REMOVE_MARKET_LOADING, addMarketLoading, removeMarketLoading } from 'modules/market/actions/update-market-loading'

describe('modules/market/actions/update-market-loading.js', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  describe('updateMarketLoading', () => {
    test({
      description: 'should return the expected object',
      assertions: () => {
        const actual = addMarketLoading('0xMARKETID')
        const expected = {
          type: ADD_MARKET_LOADING,
          data: {
            marketId: '0xMARKETID',
          },
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('removeMarketLoading', () => {
    test({
      description: 'should return the expected object',
      assertions: () => {
        const actual = removeMarketLoading('0xMARKETID')
        const expected = {
          type: REMOVE_MARKET_LOADING,
          data: {
            marketId: '0xMARKETID',
          },
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })
})
