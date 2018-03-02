import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'

describe(`modules/reporting/actions/get-payout-numerators.js`, () => {
  proxyquire.noPreserveCache().noCallThru()

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  const marketScalar = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    numOutcomes: 2,
    marketType: SCALAR,
  }

  const marketBinary = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    numOutcomes: 2,
    marketType: BINARY,
  }

  const marketCategorical = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10003,
    numOutcomes: 7,
    marketType: CATEGORICAL,
  }

  describe('scalar 75', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 75, false)
        const expected = [2500, 7500]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      },
    })
  })

  describe('scalar 50', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 50, false)
        const expected = [5000, 5000]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      },
    })
  })

  describe('scalar 25', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 25, false)
        const expected = [7500, 2500]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      },
    })
  })

  describe('scalar 45.01', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 45.01, false)
        const expected = [5499, 4501]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      },
    })
  })

  describe('scalar invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 0, true)
        const expected = [5000, 5000]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      },
    })
  })

  describe('binary NO', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketBinary, 0, false)
        const expected = [10000, 0]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('binary YES', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketBinary, 1, false)
        const expected = [0, 10000]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('binary invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketBinary, 1, true)
        const expected = [5000, 5000]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 0', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 0, false)
        const expected = [10003, 0, 0, 0, 0, 0, 0]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 3', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 3, false)
        const expected = [0, 0, 0, 10003, 0, 0, 0]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 6', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 6, false)
        const expected = [0, 0, 0, 0, 0, 0, 10003]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 0, true)
        const expected = [1429, 1429, 1429, 1429, 1429, 1429, 1429]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

})
