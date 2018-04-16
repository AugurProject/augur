

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
        bondSizeTotal: 699361165364583300,
        completedStake: '0',
        stakeCurrent: '1699361165364583300',
        accountStakeTotal: '0',
      }
      const disputeBond = 12588500976562500000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 6,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers completed % both non and account`,
    assertions: () => {
      const outcome = {
        bondSizeTotal: 4196166992187500004,
        stakeCurrent: '2098083496093750000',
        accountStakeTotal: '500000000000000000',
      }
      const disputeBond = 6294250488281250000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 59,
        percentageAccount: 8,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })


  test({
    description: `big numbers non account complete%`,
    assertions: () => {
      const outcome = {
        bondSizeTotal: 2098083496093750000,
        accountStakeTotal: '1098083496093750000',
        accountStakeCurrent: '0',
      }
      const disputeBond = 6294250488281250000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 16,
        percentageAccount: 17,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers account % complete, rounding up`,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 6294250488281250000,
        bondSizeTotal: '349680582682291650',
        completedStake: '0',
        accountStakeTotal: '133333582682291650',
      }
      const disputeBond = 6294250488281250000
      const actual = fillDisputeOutcomeProgess(disputeBond, outcome)
      const expected = {
        ...outcome,
        percentageComplete: 3,
        percentageAccount: 2,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `big numbers account % complete, 10, total 50 complete `,
    assertions: () => {
      const outcome = {
        bondSizeCurrent: 20000000000000000000,
        bondSizeTotal: '12000000000000000000',
        completedStake: '0',
        accountStakeTotal: '2000000000000000000',
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
        bondSizeTotal: 0,
        accountStakeTotal: '1000000000000000000',
        completedStake: '0',
        accountStakeCurrent: '1000000000000000000',
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
        completedStake: '0',
        bondSizeTotal: '1000000000000000000',
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
        bondSizeTotal: '7.5',
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
        bondSizeTotal: '5',
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
        bondSizeOfNewStake: 10,
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
        bondSizeOfNewStake: 0,
        percentageComplete: 0,
        percentageAccount: 0,
      }
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

})
