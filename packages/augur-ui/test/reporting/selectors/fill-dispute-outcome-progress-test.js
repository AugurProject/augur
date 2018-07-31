

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
        bondSizeCurrent: 12588500976562500000,
        completedStake: '0',
        stakeCurrent: '1699361165364583300',
        accountStakeCurrent: '0',
      }
      const disputeBond = 12588500976562500000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 13.4993,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers completed % both non and account`,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 2098083496093750000,
        stakeCurrent: '2098083496093750000',
        accountStakeCurrent: '1098083496093750000',
      }
      const disputeBond = 6294250488281250000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 47.6625,
        percentageAccount: 52.3374,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })


  test({
    description: `big numbers non account complete%`,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 2098083496093750000,
        stakeCurrent: '1098083496093750000',
        accountStakeCurrent: '0',
      }
      const disputeBond = 6294250488281250000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 52.3374,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers account % complete, rounding up`,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 6294250488281250000,
        stakeCurrent: '349680582682291650',
        completedStake: '0',
        accountStakeCurrent: '133333582682291650',
      }
      const disputeBond = 6294250488281250000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 3.4372,
        percentageAccount: 2.1183,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers account % complete, 10, total 50 complete `,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 20000000000000000000,
        stakeCurrent: '12000000000000000000',
        completedStake: '0',
        accountStakeCurrent: '2000000000000000000',
      }
      const disputeBond = 20000000000000000000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 50,
        percentageAccount: 10,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers account % complete, 50 `,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 4000000000000000000,
        stakeCurrent: '2000000000000000000',
        completedStake: '0',
        accountStakeCurrent: '2000000000000000000',
      }
      const disputeBond = 2000000000000000000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 0,
        percentageAccount: 50,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers % complete, 50 `,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 2000000000000000000,
        completedStake: '0',
        stakeCurrent: '1000000000000000000',
        accountStakeCurrent: 0,
      }
      const disputeBond = 2000000000000000000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 50,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `% complete, 75 `,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 10,
        stakeCurrent: '7.5',
        completedStake: '0',
        accountStakeCurrent: '0',
      }
      const disputeBond = 10
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 75,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `% complete, 50 `,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 10,
        stakeCurrent: '5',
        completedStake: '0',
        accountStakeCurrent: '0',
      }
      const disputeBond = 10
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 50,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `all zeros`,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 0,
        stakeCurrent: '0',
        completedStake: '0',
        accountStakeCurrent: '0',
      }
      const disputeBond = 0
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 0,
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
        percentageComplete: 0,
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
        percentageComplete: 0,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

})
