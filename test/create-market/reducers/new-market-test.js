

import newMarket from 'modules/create-market/reducers/new-market'
import { DEFAULT_SCALAR_TICK_SIZE } from 'augur.js/src/constants'

import {
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET,
} from 'modules/create-market/actions/update-new-market'

import { createBigNumber } from 'utils/create-big-number'

describe('modules/create-market/reducers/new-market.js', () => {
  const test = (t) => {
    it(t.describe, () => {
      t.assertions()
    })
  }

  test({
    describe: 'should return the default state',
    assertions: () => {
      const actual = newMarket(undefined, { type: null })

      const expected = {
        isValid: false,
        currentStep: 0,
        type: '',
        scalarSmallNum: '',
        scalarBigNum: '',
        scalarDenomination: '',
        description: '',
        designatedReporterType: '',
        designatedReporterAddress: '',
        expirySourceType: '',
        expirySource: '',
        endTime: {},
        hour: '',
        minute: '',
        meridiem: '',
        detailsText: '',
        category: '',
        tag1: '',
        tag2: '',
        outcomes: Array(8).fill(''),
        tickSize: DEFAULT_SCALAR_TICK_SIZE,
        settlementFee: 0,
        orderBook: {},
        orderBookSorted: {},
        orderBookSeries: {},
        initialLiquidityEth: createBigNumber(0),
        initialLiquidityGas: createBigNumber(0),
        validations: [
          {
            description: false,
            category: false,
            tag1: true,
            tag2: true,
          },
          {
            type: false,
          },
          {
            designatedReporterType: false,
            designatedReporterAddress: false,
            expirySourceType: false,
            endTime: false,
            hour: false,
            minute: false,
            meridiem: false,
          },
          {
            settlementFee: true,
          },
        ],
        creationError: 'Unable to create market.  Ensure your market is unique and all values are valid.',
      }

      assert.deepEqual(actual, expected, `Didn't return the expected default value`)
    },
  })

  test({
    describe: 'should return the existing value',
    assertions: () => {
      const actual = newMarket('testing', { type: null })

      const expected = 'testing'

      assert.equal(actual, expected, `Didn't return the expected existing value`)
    },
  })

  test({
    describe: 'should add order to outcome with no previous orders',
    assertions: () => {
      const newMarketState = {
        test: 'test',
        orderBook: {},
      }

      const actual = newMarket(newMarketState, {
        type: ADD_ORDER_TO_NEW_MARKET,
        data: {
          outcome: 'Outcome1',
          type: 'bid',
          price: createBigNumber(0.5),
          quantity: createBigNumber(1),
        },
      })

      const expected = {
        test: 'test',
        orderBook: {
          Outcome1: [
            {
              type: 'bid',
              price: createBigNumber(0.5),
              quantity: createBigNumber(1),
            },
          ],
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected orderBook object`)
    },
  })

  test({
    describe: 'should add order to an existing outcome',
    assertions: () => {
      const newMarketState = {
        test: 'test',
        orderBook: {
          Outcome1: [
            {
              type: 'bid',
              price: createBigNumber(0.8),
              quantity: createBigNumber(1),
            },
            {
              type: 'ask',
              price: createBigNumber(0.9),
              quantity: createBigNumber(1),
            },
          ],
        },
      }

      const actual = newMarket(newMarketState, {
        type: ADD_ORDER_TO_NEW_MARKET,
        data: {
          outcome: 'Outcome1',
          type: 'bid',
          price: createBigNumber(0.5),
          quantity: createBigNumber(1),
        },
      })

      const expected = {
        test: 'test',
        orderBook: {
          Outcome1: [
            {
              type: 'bid',
              price: createBigNumber(0.8),
              quantity: createBigNumber(1),
            },
            {
              type: 'ask',
              price: createBigNumber(0.9),
              quantity: createBigNumber(1),
            },
            {
              type: 'bid',
              price: createBigNumber(0.5),
              quantity: createBigNumber(1),
            },
          ],
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected orderBook object`)
    },
  })

  test({
    describe: 'should remove order',
    assertions: () => {
      const newMarketState = {
        test: 'test',
        orderBook: {
          Outcome1: [
            {
              type: 'bid',
              price: createBigNumber(0.8),
              quantity: createBigNumber(1),
            },
            {
              type: 'ask',
              price: createBigNumber(0.9),
              quantity: createBigNumber(1),
            },
          ],
        },
      }

      const actual = newMarket(newMarketState, {
        type: REMOVE_ORDER_FROM_NEW_MARKET,
        data: {
          outcome: 'Outcome1',
          index: 0,
        },
      })

      const expected = {
        test: 'test',
        orderBook: {
          Outcome1: [
            {
              type: 'ask',
              price: createBigNumber(0.9),
              quantity: createBigNumber(1),
            },
          ],
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected orderBook object`)
    },
  })

  test({
    describe: `should update 'newMarket'`,
    assertions: () => {
      const newMarketState = {
        test: 'test',
        anotherTest: [
          'test1',
          'test2',
        ],
      }

      const actual = newMarket(newMarketState, {
        type: UPDATE_NEW_MARKET,
        data: {
          test: 'updated test',
        },
      })

      const expected = {
        test: 'updated test',
        anotherTest: [
          'test1',
          'test2',
        ],
      }

      assert.deepEqual(actual, expected, `Didn't return the expected newMarket object`)
    },
  })

  test({
    describe: `should clear 'newMarket'`,
    assertions: () => {
      const newMarketState = {
        test: 'test',
        anotherTest: [
          'test1',
          'test2',
        ],
      }

      const actual = newMarket(newMarketState, {
        type: CLEAR_NEW_MARKET,
      })

      const expected = {
        isValid: false,
        currentStep: 0,
        type: '',
        scalarSmallNum: '',
        scalarBigNum: '',
        scalarDenomination: '',
        description: '',
        designatedReporterType: '',
        designatedReporterAddress: '',
        expirySourceType: '',
        expirySource: '',
        endTime: {},
        hour: '',
        minute: '',
        meridiem: '',
        detailsText: '',
        outcomes: Array(8).fill(''),
        tickSize: DEFAULT_SCALAR_TICK_SIZE,
        category: '',
        tag1: '',
        tag2: '',
        settlementFee: 0,
        orderBook: {},
        orderBookSorted: {},
        orderBookSeries: {},
        initialLiquidityEth: createBigNumber(0),
        initialLiquidityGas: createBigNumber(0),
        validations: [
          {
            description: false,
            category: false,
            tag1: true,
            tag2: true,
          },
          {
            type: false,
          },
          {
            designatedReporterType: false,
            designatedReporterAddress: false,
            expirySourceType: false,
            endTime: false,
            hour: false,
            minute: false,
            meridiem: false,
          },
          {
            settlementFee: true,
          },
        ],
        creationError: 'Unable to create market.  Ensure your market is unique and all values are valid.',
      }

      assert.deepEqual(actual, expected, `Didn't return the expected newMarket object`)
    },
  })
})
