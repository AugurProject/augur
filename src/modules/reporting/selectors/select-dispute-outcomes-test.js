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

  afterEach(() => {
    RewireAPI.__ResetDependency__('calculatePayoutNumeratorsValue')
  })

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

  const calculatePayoutNumeratorsValueStubb = sinon.stub()
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
    description: `scalar market with more than 10 disputes`,
    assertions: () => {
      const stakes = [
        {
          payout: [2000, 8000],
          isInvalid: false,
          tentativeWinning: true,
          totalStake: 100,
        },
        {
          payout: [1000, 9000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 90,
        },
        {
          payout: [3000, 7000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 80,
        },
        {
          payout: [4000, 6000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 70,
        },
        {
          payout: [5000, 5000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 60,
        },
        {
          payout: [6000, 4000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 55,
        },
        {
          payout: [7000, 3000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 50,
        },
        {
          payout: [8000, 2000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 40,
        },
        {
          payout: [9000, 1000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 30,
        },
        {
          payout: [10000, 0],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 20,
        },
        {
          payout: [0, 10000],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 10,
        },
        {
          payout: [1500, 8500],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 5,
        },
        {
          payout: [8500, 1500],
          isInvalid: false,
          tentativeWinning: false,
          totalStake: 0,
        },
      ]
      const actual = selectDisputeOutcomes(marketScalar, stakes)
      const expected = [
        { id: '0.5', name: 'Indeterminate' },
        { ...stakes[0], id: '80', name: '80' },
        { ...stakes[1], id: '90', name: '90' },
        { ...stakes[2], id: '70', name: '70' },
        { ...stakes[3], id: '60', name: '60' },
        { ...stakes[4], id: '50', name: '50' },
        { ...stakes[5], id: '40', name: '40' },
        { ...stakes[6], id: '30', name: '30' },
        { ...stakes[7], id: '20', name: '20' },
      ]
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
      const actual = selectDisputeOutcomes(marketScalar, stakes)
      const expected = [
        { id: '0.5', name: 'Indeterminate', ...stakes[0] },
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
      const actual = selectDisputeOutcomes(marketScalar, stakes)
      const expected = [
        { id: '0.5', name: 'Indeterminate' },
        { ...stakes[0], id: '80', name: '80' },
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
      const actual = selectDisputeOutcomes(marketScalar, stakes)
      const expected = [
        { id: '0.5', name: 'Indeterminate' },
        { ...stakes[0], id: '80', name: '80' },
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
      const actual = selectDisputeOutcomes(marketCategorical, stakes)
      const expected = [
        { id: '0', name: 'Bob' },
        { id: '1', name: 'Sue' },
        { id: '2', name: 'John' },
        { id: '3', name: 'Mark' },
        { id: '4', name: 'Joe' },
        { id: '5', name: 'Mike' },
        { id: '6', name: 'Ed' },
        { ...stakes[0], id: '0.5', name: 'Indeterminate' },
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
      const actual = selectDisputeOutcomes(marketCategorical, stakes)
      const expected = [
        { ...stakes[0], id: '0', name: 'Bob' },
        { id: '1', name: 'Sue' },
        { id: '2', name: 'John' },
        { id: '3', name: 'Mark' },
        { ...stakes[1], id: '4', name: 'Joe' },
        { id: '5', name: 'Mike' },
        { id: '6', name: 'Ed' },
        { id: '0.5', name: 'Indeterminate' },
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
      const actual = selectDisputeOutcomes(marketCategorical, stakes)
      const expected = [
        { ...stakes[0], id: '0', name: 'Bob' },
        { id: '1', name: 'Sue' },
        { id: '2', name: 'John' },
        { id: '3', name: 'Mark' },
        { id: '4', name: 'Joe' },
        { id: '5', name: 'Mike' },
        { id: '6', name: 'Ed' },
        { id: '0.5', name: 'Indeterminate' },
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
      const actual = selectDisputeOutcomes(marketBinary, stakes)
      const expected = [
        { ...stakes[0], id: '0', name: 'No' },
        { ...stakes[1], id: '1', name: 'Yes' },
        { id: '0.5', name: 'Indeterminate' },
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
      const actual = selectDisputeOutcomes(marketBinary, stakes)
      const expected = [
        { id: '0', name: 'No' },
        { id: '1', name: 'Yes' },
        { id: '0.5', name: 'Indeterminate', ...stakes[0] },
      ]
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `binary market with one disputes`,
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
      const actual = selectDisputeOutcomes(marketBinary, stakes)
      const expected = [
        { id: '0', name: 'No', ...stakes[0] },
        { id: '1', name: 'Yes' },
        { id: '0.5', name: 'Indeterminate' },
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
