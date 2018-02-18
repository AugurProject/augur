import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'

import { getPayoutNumerators } from 'modules/reporting/actions/get-payout-numerators'

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
    isScalar: true,
  }

  const marketBinary = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    numOutcomes: 2,
    isScalar: false,
  }

  const marketCategorical = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    numOutcomes: 7,
    isScalar: false,
  }

  describe('scalar 75', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 75)
        const expected = [2500, 7500]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      }
    })
  })

  describe('scalar 50', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 50)
        const expected = [5000, 5000]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      }
    })
  })

  describe('scalar 25', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 25)
        const expected = [7500, 2500]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      }
    })
  })

  describe('scalar 45.01', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, 45.01)
        const expected = [5499, 4501]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(expected[0] + expected[1], marketScalar.numTicks)
      }
    })
  })

  describe('binary NO', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketBinary, 0)
        const expected = [10000, 0]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      }
    })
  })

  describe('binary YES', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketBinary, 1)
        const expected = [0, 10000]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      }
    })
  })

  describe('categorical 0', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 0)
        const expected = [10000, 0, 0, 0, 0, 0, 0]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      }
    })
  })

  describe('categorical 3', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 3)
        const expected = [0, 0, 0, 10000, 0, 0, 0]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      }
    })
  })

  describe('categorical 6', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 6)
        const expected = [0, 0, 0, 0, 0, 0, 10000]
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      }
    })
  })
})
