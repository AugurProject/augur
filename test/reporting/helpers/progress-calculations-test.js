

import { calculatePercentage, calculateTentativeRemainingRep, calculateAddedStakePercentage, __RewireAPI__ as RewireAPI } from 'modules/reporting/helpers/progress-calculations'
import { BigNumber } from 'bignumber.js'

describe(`modules/reporting/helpers/progress-calculations.js`, () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  const formatAttoRepStubb = (a, format) => {
    const value = { formatted: a.toString() }
    return value
  }

  RewireAPI.__Rewire__('formatAttoRep', formatAttoRepStubb)

  test({
    description: `value remaining tentative stake REP`,
    assertions: () => {
      assert.deepEqual(calculateTentativeRemainingRep(new BigNumber('62000000000000000000', 10), new BigNumber('34000000000000000000', 10), 1), '27000000000000000000', `Didn't return expected`)
    },
  })

  test({
    description: `large value remaining tentative stake REP`,
    assertions: () => {
      assert.deepEqual(calculateTentativeRemainingRep(new BigNumber('6294250488281250000', 10), new BigNumber('349680582682291650', 10), 1), '4944569905598959000', `Didn't return expected`)
    },
  })

  test({
    description: `add REP stake get percentage`,
    assertions: () => {
      assert.deepEqual(calculateAddedStakePercentage(new BigNumber('10000000000000000000', 10), 0, 1), 10, `Didn't return expected`)
    },
  })

  test({
    description: `add REP stake get percentage`,
    assertions: () => {
      assert.deepEqual(calculateAddedStakePercentage(new BigNumber('10000000000000000000', 10), new BigNumber('1000000000000000000', 10), 1), 20, `Didn't return expected`)
    },
  })

  test({
    description: `0 numbers, percentage calculation`,
    assertions: () => {
      assert.deepEqual(calculatePercentage(0, 5), 0, `Didn't throw error as expected`)
    },
  })

  test({
    description: `null numbers, percentage calculation`,
    assertions: () => {
      assert.deepEqual(calculatePercentage(null, 5), 0, `Didn't throw error as expected`)
    },
  })

  test({
    description: `negative numbers, percentage calculation`,
    assertions: () => {
      assert.deepEqual(calculatePercentage(-10, 5), 0, `Didn't throw error as expected`)
    },
  })

  test({
    description: `small numbers, percentage calculation`,
    assertions: () => {
      assert.deepEqual(calculatePercentage(10, 5), 50, `Didn't call the expected method`)
    },
  })

  test({
    description: `large percentage calculation`,
    assertions: () => {
      assert.deepEqual(calculatePercentage(new BigNumber('2098083496093750000', 10), new BigNumber('109680582682291650', 10)), 5, `Didn't call the expected method`)
    },
  })

})
