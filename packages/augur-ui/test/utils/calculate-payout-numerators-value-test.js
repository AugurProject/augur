

import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'

describe(`modules/reporting/actions/calculate-payout-numerators-value.js`, () => {

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  const marketScalarMin = {
    maxPrice: 120,
    minPrice: -10,
    numTicks: 1300,
    numOutcomes: 2,
    marketType: SCALAR,
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
    marketType: YES_NO,
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
        const actual = calculatePayoutNumeratorsValue(marketScalar, [2500, 7500], false)
        const expected = '75'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('scalar sub 0 Min 75', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketScalarMin, [450, 850], false)
        const expected = '75'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('scalar sub 0 Min 73', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketScalarMin, [470, 830], false)
        const expected = '73'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('scalar sub 0 Min 25', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketScalarMin, [950, 350], false)
        const expected = '25'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('scalar 50', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketScalar, [5000, 5000], false)
        const expected = '50'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('scalar 25', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketScalar, [7500, 2500], false)
        const expected = '25'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('scalar 45.01', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketScalar, [5499, 4501], false)
        const expected = '45.01'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('scalar invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketScalar, [5000, 5000], true)
        const expected = null
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('yes/no NO', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketBinary, [10000, 0], false)
        const expected = '0'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('yes/no YES', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketBinary, [0, 10000], false)
        const expected = '1'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('yes/no invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketBinary, [5000, 5000], true)
        const expected = null
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 0', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketCategorical, [10003, 0, 0, 0, 0, 0, 0], false)
        const expected = '0'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 3', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketCategorical, [0, 0, 0, 10003, 0, 0, 0], false)
        const expected = '3'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 6', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketCategorical, [0, 0, 0, 0, 0, 0, 10003], false)
        const expected = '6'
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = calculatePayoutNumeratorsValue(marketCategorical, [1429, 1429, 1429, 1429, 1429, 1429, 1429], true)
        const expected = null
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

})
