import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import selectDisputeOutcomes, { __RewireAPI__ as RewireAPI } from 'modules/reporting/selectors/select-dispute-outcomes'

describe(`modules/reporting/selectors/select-dispute-outcomes.js`, () => {

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  after(() => {
    RewireAPI.__ResetDependency__('calculatePayoutNumeratorsValue')
  })

  const getDefaultStake = (size) => {
    const defaultValues = {
      stakeCurrent: '0',
      accountStakeCurrent: '0',
      accountStakeCompleted: '0',
      bondSizeCurrent: size,
      stakeCompleted: '0',
      stakeRemaining: size,
      tentativeWinning: false,
    }
    return defaultValues
  }

  const marketBinary = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    numOutcomes: 2,
    marketType: BINARY,
    reportableOutcomes: [{ id: '0', name: 'No' }, { id: '1', name: 'Yes' }, { id: '0.5', name: 'Indeterminate' }],
  }

  const marketCategorical = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10003,
    numOutcomes: 7,
    marketType: CATEGORICAL,
    reportableOutcomes: [
      { id: '0', name: 'Bob' },
      { id: '1', name: 'Sue' },
      { id: '2', name: 'John' },
      { id: '3', name: 'Mark' },
      { id: '4', name: 'Joe' },
      { id: '5', name: 'Mike' },
      { id: '6', name: 'Ed' },
      { id: '0.5', name: 'Indeterminate' },
    ],
  }

  const marketScalar = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    tickSize: 4,
    numOutcomes: 2,
    marketType: SCALAR,
    reportableOutcomes: [{ id: '0.5', name: 'Indeterminate' }],
  }

  const calculatePayoutNumeratorsValueStubb = sinon.stub().returns(null)
  calculatePayoutNumeratorsValueStubb.withArgs(marketBinary, [10000, 0], false).returns('0')
  calculatePayoutNumeratorsValueStubb.withArgs(marketBinary, [0, 10000], false).returns('1')
  calculatePayoutNumeratorsValueStubb.withArgs(marketBinary, [5000, 5000], true).returns(null)
  calculatePayoutNumeratorsValueStubb.withArgs(marketCategorical, [10003, 0, 0, 0, 0, 0, 0], false).returns('0')
  calculatePayoutNumeratorsValueStubb.withArgs(marketCategorical, [0, 0, 0, 0, 10003, 0, 0], false).returns('4')
  calculatePayoutNumeratorsValueStubb.withArgs(marketCategorical, [1429, 1429, 1429, 1429, 1429, 1429, 1429], true).returns(null)
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [2000, 8000], false).returns('80')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [1000, 9000], false).returns('90')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [3000, 7000], false).returns('70')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [4000, 6000], false).returns('60')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [5000, 5000], false).returns('50')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [6000, 4000], false).returns('40')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [7000, 3000], false).returns('30')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [8000, 2000], false).returns('20')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [9000, 1000], false).returns('10')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [10000, 0], false).returns('0')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [0, 10000], false).returns('100')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [1500, 8500], false).returns('85')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [8500, 1500], false).returns('15')
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [5000, 5000], true).returns(null)
  RewireAPI.__Rewire__('calculatePayoutNumeratorsValue', calculatePayoutNumeratorsValueStubb)

  test({
    description: `scalar market with more than 9 disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [1000, 9000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 90,
          stakeRemaining: 0,
        },
        {
          payout: [3000, 7000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 70,
          stakeRemaining: 0,
        },
        {
          payout: [2000, 8000],
          isInvalid: false,
          tentativeWinning: true,
          stakeCurrent: 80,
          stakeRemaining: 0,
        },
        {
          payout: [4000, 6000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 60,
          stakeRemaining: 0,
        },
        {
          payout: [6000, 4000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 40,
          stakeRemaining: 0,
        },
        {
          payout: [7000, 3000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 30,
          stakeRemaining: 0,
        },
        {
          payout: [8000, 2000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 20,
          stakeRemaining: 0,
        },
        {
          payout: [5000, 5000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 50,
          stakeRemaining: 0,
        },
        {
          payout: [9000, 1000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 10,
          stakeRemaining: 0,
        },
        {
          payout: [10000, 0],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 0,
          stakeRemaining: 0,
        },
        {
          payout: [0, 10000],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 100,
          stakeRemaining: 0,
        },
        {
          payout: [1500, 8500],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 85,
          stakeRemaining: 0,
        },
        {
          payout: [8500, 1500],
          isInvalid: false,
          tentativeWinning: false,
          stakeCurrent: 15,
          stakeRemaining: 0,
        },
      ]
      const expected = [
        { ...stakes[2], id: '80', name: '80' },
        { ...stakes[10], id: '100', name: '100' },
        { ...stakes[0], id: '90', name: '90' },
        { ...stakes[11], id: '85', name: '85' },
        { ...stakes[1], id: '70', name: '70' },
        { ...stakes[3], id: '60', name: '60' },
        { ...stakes[7], id: '50', name: '50' },
        { ...stakes[4], id: '40', name: '40' },
        { ...stakes[5], id: '30', name: '30' },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100)

      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })


  test({
    description: `scalar market with invalid disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [
            5000,
            5000,
          ],
          isInvalid: true,
          tentativeWinning: true,
        },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100)
      const expected = [
        {
          ...getDefaultStake(100),
          id: '0.5',
          name: 'Indeterminate',
          ...stakes[0],
        },
      ]
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `scalar market with two disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [2000, 8000],
          isInvalid: false,
          tentativeWinning: true,
        },
        {
          payout: [1000, 9000],
          isInvalid: false,
          tentativeWinning: false,
        },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100)
      const expected = [
        { ...stakes[0], id: '80', name: '80' },
        { id: '0.5', name: 'Indeterminate', ...getDefaultStake(100) },
        { ...stakes[1], id: '90', name: '90' },
      ]

      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `scalar market with one disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [2000, 8000],
          isInvalid: false,
          tentativeWinning: true,
        },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100)
      const expected = [
        {
          ...stakes[0],
          id: '80',
          name: '80',
        },
        { ...getDefaultStake(100), id: '0.5', name: 'Indeterminate' },
      ]
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `categorical market with invalid disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [1429, 1429, 1429, 1429, 1429, 1429, 1429],
          isInvalid: true,
          tentativeWinning: true,
        },
      ]
      const actual = selectDisputeOutcomes(marketCategorical, stakes, 100)
      const expected = [
        {
          ...getDefaultStake(100),
          ...stakes[0],
          id: '0.5',
          name: 'Indeterminate',
        },
        { ...getDefaultStake(100), id: '0', name: 'Bob' },
        { ...getDefaultStake(100), id: '1', name: 'Sue' },
        { ...getDefaultStake(100), id: '2', name: 'John' },
        { ...getDefaultStake(100), id: '3', name: 'Mark' },
        { ...getDefaultStake(100), id: '4', name: 'Joe' },
        { ...getDefaultStake(100), id: '5', name: 'Mike' },
        { ...getDefaultStake(100), id: '6', name: 'Ed' },
      ]
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `categorical market with two disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [10003, 0, 0, 0, 0, 0, 0],
          isInvalid: false,
          tentativeWinning: true,
        },
        {
          payout: [0, 0, 0, 0, 10003, 0, 0],
          isInvalid: false,
          tentativeWinning: false,
        },
      ]
      const actual = selectDisputeOutcomes(marketCategorical, stakes, 100)
      const expected = [
        {
          ...getDefaultStake(100),
          ...stakes[0],
          id: '0',
          name: 'Bob',
        },
        { ...getDefaultStake(100), id: '1', name: 'Sue' },
        { ...getDefaultStake(100), id: '2', name: 'John' },
        { ...getDefaultStake(100), id: '3', name: 'Mark' },
        {
          ...getDefaultStake(100),
          ...stakes[1],
          id: '4',
          name: 'Joe',
        },
        { ...getDefaultStake(100), id: '5', name: 'Mike' },
        { ...getDefaultStake(100), id: '6', name: 'Ed' },
        { ...getDefaultStake(100), id: '0.5', name: 'Indeterminate' },
      ]
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `categorical market with one disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [10003, 0, 0, 0, 0, 0, 0],
          isInvalid: false,
          tentativeWinning: true,
        },
      ]
      const actual = selectDisputeOutcomes(marketCategorical, stakes, 100)
      const expected = [
        {
          ...getDefaultStake(100),
          ...stakes[0],
          id: '0',
          name: 'Bob',
        },
        { ...getDefaultStake(100), id: '1', name: 'Sue' },
        { ...getDefaultStake(100), id: '2', name: 'John' },
        { ...getDefaultStake(100), id: '3', name: 'Mark' },
        { ...getDefaultStake(100), id: '4', name: 'Joe' },
        { ...getDefaultStake(100), id: '5', name: 'Mike' },
        { ...getDefaultStake(100), id: '6', name: 'Ed' },
        { ...getDefaultStake(100), id: '0.5', name: 'Indeterminate' },
      ]

      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `binary market with two disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [
            10000,
            0,
          ],
          isInvalid: false,
          tentativeWinning: true,
        },
        {
          payout: [
            0,
            10000,
          ],
          isInvalid: false,
          tentativeWinning: false,
        },
      ]
      const actual = selectDisputeOutcomes(marketBinary, stakes, 100)
      const expected = [
        {
          ...getDefaultStake(100),
          ...stakes[0],
          id: '0',
          name: 'No',
        },
        {
          ...getDefaultStake(100),
          ...stakes[1],
          id: '1',
          name: 'Yes',
        },
        { ...getDefaultStake(100), id: '0.5', name: 'Indeterminate' },
      ]

      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })


  test({
    description: `binary market with invalid disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [
            5000,
            5000,
          ],
          isInvalid: true,
          tentativeWinning: true,
        },
      ]
      const actual = selectDisputeOutcomes(marketBinary, stakes, 100)
      const expected = [
        {
          ...getDefaultStake(100),
          id: '0.5',
          name: 'Indeterminate',
          ...stakes[0],
        },
        { id: '0', name: 'No', ...getDefaultStake(100) },
        { id: '1', name: 'Yes', ...getDefaultStake(100) },
      ]

      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `binary market with one dispute`,
    assertions: () => {
      const stakes = [
        {
          payout: [
            10000,
            0,
          ],
          isInvalid: false,
          tentativeWinning: true,
        },
      ]
      const actual = selectDisputeOutcomes(marketBinary, stakes, 100)
      const expected = [
        {
          ...getDefaultStake(100),
          id: '0',
          name: 'No',
          ...stakes[0],
        },
        { id: '1', name: 'Yes', ...getDefaultStake(100) },
        { id: '0.5', name: 'Indeterminate', ...getDefaultStake(100) },
      ]
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `binary market with NO disputes`,
    assertions: () => {
      const actual = selectDisputeOutcomes(marketBinary, [])
      const expected = marketBinary.reportableOutcomes
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `category market with NO disputes`,
    assertions: () => {
      const actual = selectDisputeOutcomes(marketCategorical, [])
      const expected = marketCategorical.reportableOutcomes
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `scalar market with NO disputes`,
    assertions: () => {
      const actual = selectDisputeOutcomes(marketScalar, [])
      const expected = marketScalar.reportableOutcomes
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })
})
