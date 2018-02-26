import { describe, it } from 'mocha'
import { assert } from 'chai'
import BigNumber from 'bignumber.js'

import calcProfits from 'modules/trade/helpers/calc-order-profit-loss-percents'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { BINARY, SCALAR } from 'modules/markets/constants/market-types'

describe('modules/trade/helpers/calc-order-profit-loss-percents.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return null when an argument is missing`,
    assertions: () => {
      const actual = calcProfits()

      const expected = null

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })

  test({
    description: `should return null when given a SCALAR market with non numerical minPrice`,
    assertions: () => {
      const actual = calcProfits(
        '10',
        '1',
        SELL,
        '190-242nota valid number',
        '10',
        SCALAR
      )

      const expected = null

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })

  test({
    description: `should return null when given a SCALAR market with non numerical maxPrice`,
    assertions: () => {
      const actual = calcProfits(
        '10',
        '1',
        SELL,
        '-1',
        '10abc this is not a valid number',
        SCALAR
      )

      const expected = null

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })

  test({
    description: `should return the expected profit and loss values for a BUY in a BINARY market`,
    assertions: () => {
      const actual = calcProfits(
        '10',
        '0.4',
        BUY,
        '1',
        '2',
        BINARY,
        '10',
        '4'
      )

      const expected = {
        potentialEthProfit: new BigNumber('6'),
        potentialEthLoss: new BigNumber('4'),
        potentialProfitPercent: new BigNumber('150'),
        potentialLossPercent: new BigNumber('100')
      }

      assert.deepEqual(actual, expected, `didn't return the expected profit and loss values`)
    }
  })

  test({
    description: `should return the expected profit and loss values for a SELL in a BINARY market`,
    assertions: () => {
      const actual = calcProfits(
        '10',
        '0.4',
        SELL,
        '1',
        '2',
        BINARY,
        '10',
        '6'
      )

      const expected = {
        potentialEthProfit: new BigNumber('4'),
        potentialEthLoss: new BigNumber('6'),
        potentialProfitPercent: new BigNumber('100'),
        potentialLossPercent: new BigNumber('150')
      }

      assert.deepEqual(actual, expected, `didn't return the expected profit and loss values`)
    }
  })

  test({
    description: `should return the expected profit and loss values for a BUY in a SCALAR market`,
    assertions: () => {
      const actual = calcProfits(
        '10',
        '1',
        BUY,
        '-5',
        '10',
        SCALAR,
        '10',
        '60'
      )

      const expected = {
        potentialEthProfit: new BigNumber('90'),
        potentialEthLoss: new BigNumber('60'),
        potentialProfitPercent: new BigNumber('150'),
        potentialLossPercent: new BigNumber('100')
      }

      assert.deepEqual(actual, expected, `didn't return the expected profit and loss values`)
    }
  })

  test({
    description: `should return the expected profit and loss values for a SELL in a SCALAR market`,
    assertions: () => {
      const actual = calcProfits(
        '10',
        '1',
        SELL,
        '-5',
        '10',
        SCALAR,
        '10',
        '90'
      )

      const expected = {
        potentialEthProfit: new BigNumber('60'),
        potentialEthLoss: new BigNumber('90'),
        potentialProfitPercent: new BigNumber('100'),
        potentialLossPercent: new BigNumber('150')
      }

      assert.deepEqual(actual, expected, `didn't return the expected profit and loss values`)
    }
  })
})
