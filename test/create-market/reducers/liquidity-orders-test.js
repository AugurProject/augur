

import liquidityOrders from 'modules/create-market/reducers/liquidity-orders'

import {
  UPDATE_LIQUIDITY_ORDER,
  ADD_MARKET_LIQUIDITY_ORDERS,
  REMOVE_LIQUIDITY_ORDER,
  LOAD_PENDING_LIQUIDITY_ORDERS,
  CLEAR_ALL_MARKET_ORDERS,
} from 'modules/create-market/actions/liquidity-management'

describe('modules/create-market/reducers/liquidity-orders.js', () => {
  const test = (t) => {
    it(t.describe, () => {
      t.assertions()
    })
  }

  test({
    describe: 'should return the default state',
    assertions: () => {
      const actual = liquidityOrders(undefined, { type: null })

      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected default value`)
    },
  })

  test({
    describe: 'should return the existing value',
    assertions: () => {
      const actual = liquidityOrders('testing', { type: null })

      const expected = 'testing'

      assert.equal(actual, expected, `Didn't return the expected existing value`)
    },
  })

  test({
    describe: 'should handle loading pending liquidity orders',
    assertions: () => {
      const data = {
        marketId: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5' },
          ],
        },
      }
      const actual = liquidityOrders(undefined, { type: LOAD_PENDING_LIQUIDITY_ORDERS, data })

      const expected = data

      assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
    },
  })

  test({
    describe: 'should handle adding market liquidity orders',
    assertions: () => {
      const data = {
        marketId: 'marketId',
        liquidityOrders: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5' },
          ],
        },
      }
      const actual = liquidityOrders({ marketId: {} }, { type: ADD_MARKET_LIQUIDITY_ORDERS, data })

      const expected = {
        [data.marketId]: {
          1: [
            { ...data.liquidityOrders[1][0], index: 0 },
          ],
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected updated pending orders`)
    },
  })

  test({
    describe: 'should handle adding market liquidity orders if no market existed before',
    assertions: () => {
      const data = {
        marketId: 'marketId',
        liquidityOrders: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5' },
          ],
        },
      }
      const actual = liquidityOrders({}, { type: ADD_MARKET_LIQUIDITY_ORDERS, data })

      const expected = {
        [data.marketId]: {
          1: [
            { ...data.liquidityOrders[1][0], index: 0 },
          ],
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected updated pending orders`)
    },
  })

  test({
    describe: 'should handle clearing all market orders',
    assertions: () => {
      const data = 'marketId'
      const actual = liquidityOrders({
        marketId: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5', index: 0 },
            { quantity: '5', price: '0.6', type: 'bid', estimatedCost: '3', index: 1 },
            { quantity: '5', price: '0.7', type: 'ask', estimatedCost: '1.5', index: 2 },
          ],
        },
      }, { type: CLEAR_ALL_MARKET_ORDERS, data })

      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected updated pending orders`)
    },
  })

  test({
    describe: 'should handle updating a specific order',
    assertions: () => {
      const data = {
        marketId: 'marketId',
        outcomeId: 1,
        order: {
          quantity: '5',
          price: '0.7',
          type: 'ask',
          estimatedCost: '1.5',
          index: 2,
        },
        updates: { onSent: true, txHash: '0xdeadbeef', orderId: '0xOrderId' },
      }
      const actual = liquidityOrders({
        marketId: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5', index: 0 },
            { quantity: '5', price: '0.6', type: 'bid', estimatedCost: '3', index: 1 },
            { quantity: '5', price: '0.7', type: 'ask', estimatedCost: '1.5', index: 2 },
          ],
        },
      }, { type: UPDATE_LIQUIDITY_ORDER, data })

      const expected = {
        marketId: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5', index: 0 },
            { quantity: '5', price: '0.6', type: 'bid', estimatedCost: '3', index: 1 },
            {
              quantity: '5',
              price: '0.7',
              type: 'ask',
              estimatedCost: '1.5',
              index: 2,
              onSent: true,
              txHash: '0xdeadbeef',
              orderId: '0xOrderId',
            },
          ],
        },
      }
      assert.deepEqual(actual, expected, `Didn't return the expected updated pending orders`)
    },
  })

  test({
    describe: 'should handle removing a specific order when a market still has more orders for that outcome',
    assertions: () => {
      const data = {
        marketId: 'marketId',
        outcomeId: 1,
        orderId: 2,
      }
      const actual = liquidityOrders({
        marketId: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5', index: 0 },
            { quantity: '5', price: '0.6', type: 'bid', estimatedCost: '3', index: 1 },
            { quantity: '5', price: '0.7', type: 'ask', estimatedCost: '1.5', index: 2 },
          ],
        },
      }, { type: REMOVE_LIQUIDITY_ORDER, data })

      const expected = {
        marketId: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5', index: 0 },
            { quantity: '5', price: '0.6', type: 'bid', estimatedCost: '3', index: 1 },
          ],
        },
      }
      assert.deepEqual(actual, expected, `Didn't return the expected updated pending orders`)
    },
  })

  test({
    describe: 'should handle removing the last order for a specific outcome on a market with more outcome orders to place',
    assertions: () => {
      const data = {
        marketId: 'marketId',
        outcomeId: 'apple',
        orderId: 0,
      }
      const actual = liquidityOrders({
        marketId: {
          apple: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5', index: 0 },
          ],
          banana: [
            { quantity: '2', price: '0.5', type: 'bid', estimatedCost: '1', index: 0 },
            { quantity: '2', price: '0.6', type: 'bid', estimatedCost: '1.2', index: 1 },
            { quantity: '2', price: '0.7', type: 'ask', estimatedCost: '0.6', index: 2 },
          ],
        },
      }, { type: REMOVE_LIQUIDITY_ORDER, data })

      const expected = {
        marketId: {
          banana: [
            { quantity: '2', price: '0.5', type: 'bid', estimatedCost: '1', index: 0 },
            { quantity: '2', price: '0.6', type: 'bid', estimatedCost: '1.2', index: 1 },
            { quantity: '2', price: '0.7', type: 'ask', estimatedCost: '0.6', index: 2 },
          ],
        },
      }
      assert.deepEqual(actual, expected, `Didn't return the expected updated pending orders`)
    },
  })

  test({
    describe: `should handle removing the last order for a market on the market's final outcome`,
    assertions: () => {
      const data = {
        marketId: 'marketId',
        outcomeId: 1,
        orderId: 0,
      }
      const actual = liquidityOrders({
        marketId: {
          1: [
            { quantity: '3', price: '0.5', type: 'bid', estimatedCost: '1.5', index: 0 },
          ],
        },
      }, { type: REMOVE_LIQUIDITY_ORDER, data })

      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected updated pending orders`)
    },
  })
})
