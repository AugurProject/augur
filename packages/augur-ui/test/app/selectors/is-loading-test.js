import { MARKET_INFO_LOADED, MARKET_INFO_LOADING, MARKET_FULLY_LOADED, MARKET_FULLY_LOADING } from 'modules/market/constants/market-loading-states'
import { isLoading } from 'modules/app/selectors/is-loading'

describe(`modules/app/selectors/is-loading.js`, () => {
  const test = t => it(t.description, () => t.assertions())


  test({
    description: `empty should be false`,
    assertions: () => {

      const value = {}
      const actual = isLoading(value)

      assert.strictEqual(actual, false, `didn't return expected value`)
    },
  })

  test({
    description: `non loading should be false`,
    assertions: () => {

      const value = {
        marketId: MARKET_INFO_LOADED,
        marketId2: MARKET_FULLY_LOADED,
      }

      const actual = isLoading(value)

      assert.strictEqual(actual, false, `didn't return expected value`)
    },
  })

  test({
    description: `some loading should be true`,
    assertions: () => {

      const value = {
        marketId: MARKET_INFO_LOADED,
        marketId2: MARKET_FULLY_LOADED,
        marketId3: MARKET_INFO_LOADING,
      }

      const actual = isLoading(value)

      assert.strictEqual(actual, true, `didn't return expected value`)
    },
  })

  test({
    description: `all loading should be true`,
    assertions: () => {

      const value = {
        marketId2: MARKET_FULLY_LOADING,
        marketId3: MARKET_INFO_LOADING,
      }

      const actual = isLoading(value)

      assert.strictEqual(actual, true, `didn't return expected value`)
    },
  })

})
