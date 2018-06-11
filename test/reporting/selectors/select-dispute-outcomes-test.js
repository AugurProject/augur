

import sinon from 'sinon'
import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
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
      potentialFork: false,
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
    marketType: YES_NO,
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
  calculatePayoutNumeratorsValueStubb.withArgs(marketScalar, [5000, 5000], true).returns('0.5')
  RewireAPI.__Rewire__('calculatePayoutNumeratorsValue', calculatePayoutNumeratorsValueStubb)

  test({
    description: `scalar market with more than 9 disputes and includes indeterminate`,
    assertions: () => {
      const stakes = [
        {
          payout: [1000, 9000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '90',
          stakeRemaining: '20',
          id: '90',
          name: '90',
        },
        {
          payout: [3000, 7000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '70',
          stakeRemaining: '35',
          id: '70',
          name: '70',
        },
        {
          payout: [2000, 8000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: true,
          stakeCurrent: '80',
          stakeRemaining: '10',
          id: '80',
          name: '80',
        },
        {
          payout: [4000, 6000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '60',
          stakeRemaining: '40',
          id: '60',
          name: '60',
        },
        {
          payout: [6000, 4000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '40',
          stakeRemaining: '60',
          id: '40',
          name: '40',
        },
        {
          payout: [7000, 3000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '30',
          stakeRemaining: '70',
          id: '30',
          name: '30',
        },
        {
          payout: [8000, 2000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '20',
          stakeRemaining: '300',
          id: '20',
          name: '20',
        },
        {
          payout: [5000, 5000],
          isInvalid: true,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '50',
          accountStakeCompleted: '0',
          accountStakeCurrent: '0',
          stakeCompleted: '0',
          bondSizeCurrent: 100,
          stakeRemaining: '50',
          id: '0.5',
          name: 'Indeterminate',
        },
        {
          payout: [9000, 1000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '10',
          stakeRemaining: '200',
          id: '10',
          name: '10',
        },
        {
          payout: [10000, 0],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '0',
          stakeRemaining: '100',
          id: '0',
          name: '0',
        },
        {
          payout: [0, 10000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '100',
          stakeRemaining: '15',
          id: '100',
          name: '100',
        },
        {
          payout: [1500, 8500],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '85',
          stakeRemaining: '30',
          id: '85',
          name: '85',
        },
        {
          payout: [8500, 1500],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '15',
          stakeRemaining: '400',
          id: '15',
          name: '15',
        },
      ]
      const expected = [
        { ...stakes[2] },
        { ...stakes[10] },
        { ...stakes[0] },
        { ...stakes[11] },
        { ...stakes[1] },
        { ...stakes[3] },
        { ...stakes[7] },
        { ...stakes[4] },
        { ...stakes[5] },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100, 10000000000)
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
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100, 1000000000)
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
    description: `scalar market with invalid disputes sort`,
    assertions: () => {
      const stakes = [
        {
          payout: [2000, 8000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: true,
          id: '80',
          name: 'name',
        },
        {
          payout: [1000, 9000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '10',
          stakeRemaining: '10',
          id: '90',
          name: '90',
        },
        {
          payout: [9000, 1000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '70',
          stakeRemaining: '70',
          id: '10',
          name: '10',
        },
        {
          accountStakeCompleted: '0',
          accountStakeCurrent: '0',
          bondSizeCurrent: '100',
          stakeCompleted: '0',
          payout: [5000, 5000],
          isInvalid: true,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '25',
          stakeRemaining: '25',
          id: '0.5',
          name: 'Indeterminate',
        },
        {
          payout: [1500, 8500],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeCurrent: '85',
          stakeRemaining: '85',
          id: '85',
          name: '85',
        },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100, 1000000000)
      const expected = [
        { ...stakes[0] },
        { ...stakes[1], stakeRemaining: '10' },
        { ...stakes[3], stakeRemaining: '25' },
        { ...stakes[2], stakeRemaining: '70' },
        { ...stakes[4], stakeRemaining: '85' },
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
          potentialFork: false,
          tentativeWinning: true,
        },
        {
          payout: [1000, 9000],
          isInvalid: false,
          potentialFork: false,
          tentativeWinning: false,
          stakeRemaining: 50,
        },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100, 1000000000)
      const expected = [
        { ...stakes[0], id: '80', name: '80' },
        { ...stakes[1], id: '90', name: '90' },
        { id: '0.5', name: 'Indeterminate', ...getDefaultStake(100) },
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
          potentialFork: false,
          tentativeWinning: true,
        },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes, 100, 1000000000)
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
      const actual = selectDisputeOutcomes(marketCategorical, stakes, 100, 1000000000)
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
      const actual = selectDisputeOutcomes(marketCategorical, stakes, 100, 1000000000)
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
      const actual = selectDisputeOutcomes(marketCategorical, stakes, 100, 1000000000)
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
    description: `yes/no  market with two disputes`,
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
      const actual = selectDisputeOutcomes(marketBinary, stakes, 100, 1000000000)
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
    description: `yes/no  market with invalid disputes`,
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
      const actual = selectDisputeOutcomes(marketBinary, stakes, 100, 1000000000)
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
    description: `yes/no  market with one dispute`,
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
      const actual = selectDisputeOutcomes(marketBinary, stakes, 100, 1000000000)
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
    description: `yes/no  market with NO disputes`,
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
