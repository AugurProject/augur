

import proxyquire from 'proxyquire'

import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'
import { createBigNumber } from 'utils/create-big-number'

describe(`modules/reporting/actions/get-payout-numerators.js`, () => {
  proxyquire.noPreserveCache().noCallThru()

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  const marketScalarMin = {
    maxPrice: createBigNumber(120),
    minPrice: createBigNumber(-10),
    numTicks: '1300',
    numOutcomes: 2,
    marketType: SCALAR,
  }

  const marketScalar = {
    maxPrice: createBigNumber(100),
    minPrice: createBigNumber(0),
    numTicks: '10000',
    numOutcomes: 2,
    marketType: SCALAR,
  }

  const marketBinary = {
    maxPrice: createBigNumber(100),
    minPrice: createBigNumber(0),
    numTicks: '10000',
    numOutcomes: 2,
    marketType: YES_NO,
  }

  const marketCategorical = {
    maxPrice: createBigNumber(100),
    minPrice: createBigNumber(0),
    numTicks: '10003',
    numOutcomes: 7,
    marketType: CATEGORICAL,
  }

  describe('scalar 75', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, '75', false).map(n => n.toString())
        const expected = ['2500', '7500']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(createBigNumber(expected[0]).plus(createBigNumber(expected[1])).toFixed(), marketScalar.numTicks)
      },
    })
  })

  describe('scalar 75 sub 0 Min', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalarMin, '75', false).map(n => n.toString())
        const expected = ['450', '850']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(createBigNumber(expected[0]).plus(createBigNumber(expected[1])).toFixed(), marketScalarMin.numTicks)
      },
    })
  })

  describe('scalar 25 sub 0 Min', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalarMin, '25', false).map(n => n.toString())
        const expected = ['950', '350']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(createBigNumber(expected[0]).plus(createBigNumber(expected[1])).toFixed(), marketScalarMin.numTicks)
      },
    })
  })


  describe('scalar 50', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, '50', false).map(n => n.toString())
        const expected = ['5000', '5000']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(createBigNumber(expected[0]).plus(createBigNumber(expected[1])).toFixed(), marketScalar.numTicks)
      },
    })
  })

  describe('scalar 25', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, '25', false).map(n => n.toString())
        const expected = ['7500', '2500']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(createBigNumber(expected[0]).plus(createBigNumber(expected[1])).toFixed(), marketScalar.numTicks)
      },
    })
  })

  describe('scalar 45.01', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, '45.01', false).map(n => n.toString())
        const expected = ['5499', '4501']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(createBigNumber(expected[0]).plus(createBigNumber(expected[1])).toFixed(), marketScalar.numTicks)
      },
    })
  })

  describe('scalar invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketScalar, '0', true).map(n => n.toString())
        const expected = ['5000', '5000']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
        assert.deepEqual(createBigNumber(expected[0]).plus(createBigNumber(expected[1])).toFixed(), marketScalar.numTicks)
      },
    })
  })

  describe('yes/no NO', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketBinary, 0, false).map(n => n.toString())
        const expected = ['10000', '0']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('yes/no YES', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketBinary, 1, false).map(n => n.toString())
        const expected = ['0', '10000']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('yes/no invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketBinary, 1, true).map(n => n.toString())
        const expected = ['5000', '5000']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 0', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 0, false).map(n => n.toString())
        const expected = ['10003', '0', '0', '0', '0', '0', '0']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 3', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 3, false).map(n => n.toString())
        const expected = ['0', '0', '0', '10003', '0', '0', '0']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical 6', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 6, false).map(n => n.toString())
        const expected = ['0', '0', '0', '0', '0', '0', '10003']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('categorical invalid', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = getPayoutNumerators(marketCategorical, 0, true).map(n => n.toString())
        const expected = ['1429', '1429', '1429', '1429', '1429', '1429', '1429']
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

})
