import { describe, it } from 'mocha'
import { assert } from 'chai'
import fillDisputeOutcomeProgess, { __RewireAPI__ as RewireAPI } from 'modules/reporting/selectors/fill-dispute-outcome-progress'

describe(`modules/reporting/selectors/fill-dispute-outcome-progress.js`, () => {
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
    description: `get remaining rep`,
    assertions: () => {
      const outcome = {
        size: 12588500976562500000,
        completedStake: '0',
        stakeCurrent: '1699361165364583300',
        accountStakeComplete: '0',
      }
      const disputeBond = 12588500976562500000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 13,
        remainingRep: '10889139811197917000',
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `mismatch bond and size, old dispute value`,
    assertions: () => {
      const outcome = {
        size: 2098083496093750000,
        stakeCurrent: '0',
        completedStake: '2098083496093750000',
        accountStakeComplete: '103333582682291650',
      }
      const disputeBond = 6294250488281250000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 0,
        remainingRep: '6294250488281250000',
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers account % complete, rounding up`,
    assertions: () => {
      const outcome = {
        size: 6294250488281250000,
        stakeCurrent: '349680582682291650',
        completedStake: '0',
        accountStakeComplete: '133333582682291650',
      }
      const disputeBond = 6294250488281250000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 6,
        remainingRep: '5944569905598959000',
        percentageAccount: 2,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers account % complete, 10, total 50 complete `,
    assertions: () => {
      const outcome = {
        size: 20000000000000000000,
        stakeCurrent: '10000000000000000000',
        completedStake: '0',
        accountStakeComplete: '2000000000000000000',
      }
      const disputeBond = 20000000000000000000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 50,
        remainingRep: '10000000000000000000',
        percentageAccount: 10,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers account % complete, 50 `,
    assertions: () => {
      const outcome = {
        size: 2000000000000000000,
        stakeCurrent: '1000000000000000000',
        completedStake: '0',
        accountStakeComplete: '1000000000000000000',
      }
      const disputeBond = 2000000000000000000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 50,
        remainingRep: '1000000000000000000',
        percentageAccount: 50,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers % complete, 50 `,
    assertions: () => {
      const outcome = {
        size: 2000000000000000000,
        completedStake: '0',
        stakeCurrent: '1000000000000000000',
        accountStakeComplete: 0,
      }
      const disputeBond = 2000000000000000000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 50,
        remainingRep: '1000000000000000000',
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `% complete, 75 `,
    assertions: () => {
      const outcome = {
        size: 10,
        stakeCurrent: '7.5',
        completedStake: '0',
        accountStakeComplete: '0',
      }
      const disputeBond = 10
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 75,
        remainingRep: '2.5',
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `% complete, 50 `,
    assertions: () => {
      const outcome = {
        size: 10,
        stakeCurrent: '5',
        completedStake: '0',
        accountStakeComplete: '0',
      }
      const disputeBond = 10
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 50,
        remainingRep: '5',
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `all zeros`,
    assertions: () => {
      const outcome = {
        size: 0,
        stakeCurrent: '0',
        completedStake: '0',
        accountStakeComplete: '0',
      }
      const disputeBond = 0
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 0,
        remainingRep: '0',
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `empty object with bond`,
    assertions: () => {
      const outcome = { }
      const disputeBond = 10
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        size: 10,
        percentageComplete: 0,
        remainingRep: '10',
        stakeCurrent: 0,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `empty object`,
    assertions: () => {
      const outcome = { }
      const disputeBond = 0
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        size: 0,
        percentageComplete: 0,
        stakeCurrent: 0,
        remainingRep: '0',
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

})
