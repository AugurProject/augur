import { describe, it } from 'mocha'
import { assert } from 'chai'
import { calculatePercentage, calculateRemainingRep, calculateTentativeRemainingRep, calculateTentativeStakePercentage, __RewireAPI__ as RewireAPI } from 'modules/reporting/helpers/progress-calculations'

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
    description: `large value tentative stake percentage`,
    assertions: () => {
      assert.deepEqual(calculateTentativeStakePercentage(6294250488281250000, 349680582682291650, 2), 37, `Didn't return expected`)
    },
  })

  test({
    description: `value tentative stake percentage`,
    assertions: () => {
      assert.deepEqual(calculateTentativeStakePercentage(62000000000000000000, 34000000000000000000, 1), 56, `Didn't return expected`)
    },
  })

  test({
    description: `value remaining tentative stake REP`,
    assertions: () => {
      assert.deepEqual(calculateTentativeRemainingRep(62000000000000000000, 34000000000000000000, 1), '27000000000000000000', `Didn't return expected`)
    },
  })

  test({
    description: `large value remaining tentative stake REP`,
    assertions: () => {
      assert.deepEqual(calculateTentativeRemainingRep(6294250488281250000, 349680582682291650, 1), '4944569905598959000', `Didn't return expected`)
    },
  })

  test({
    description: `large value remaining REP`,
    assertions: () => {
      assert.deepEqual(calculateRemainingRep(6294250488281250000, 349680582682291650), '5944569905598959000', `Didn't return expected`)
    },
  })

  test({
    description: `positive remaining REP`,
    assertions: () => {
      assert.deepEqual(calculateRemainingRep(10, 5), '5', `Didn't return expected`)
    },
  })

  test({
    description: `negative remaining`,
    assertions: () => {
      assert.deepEqual(calculateRemainingRep(0, 5), '-5', `Didn't return as expected`)
    },
  })

  test({
    description: `0 numbers, percentage calculation`,
    assertions: () => {
      assert.throws(() => { calculatePercentage(0, 5) }, Error, 'Can not divide by 0', `Didn't throw error as expected`)
    },
  })

  test({
    description: `null numbers, percentage calculation`,
    assertions: () => {
      assert.throws(() => { calculatePercentage(null, 5) }, Error, 'Can not use null values', `Didn't call the expected method`)
    },
  })

  test({
    description: `negative numbers, percentage calculation`,
    assertions: () => {
      assert.throws(() => { calculatePercentage(-10, 5) }, Error, 'Can not have negative percentag', `Didn't call the expected method`)
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
      assert.deepEqual(calculatePercentage(2098083496093750000, 109680582682291650), 5, `Didn't call the expected method`)
    },
  })

})
