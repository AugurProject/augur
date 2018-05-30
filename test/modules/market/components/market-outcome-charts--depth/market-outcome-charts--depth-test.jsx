import { nearestCompletelyFillingOrder } from 'src/modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth'

import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'
import { createBigNumber } from 'src/utils/create-big-number'

describe('src/modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth.jsx', () => {
  let price
  let result

  // depth, price, qty, isSelectable
  let marketDepth = {
    bids: [
      [createBigNumber(0.0001), 0.28, 0.003, true],
      [createBigNumber(0.001), 0.28, 0.001, false],
      [createBigNumber(0.003), 0.25, 0.002, true],
      [createBigNumber(0.006), 0.19, 0.003, true],

    ],
    asks: [
      [createBigNumber(0.0005), 0.28, 0.001, false],
      [createBigNumber(0.0005), 0.28, 0.001, true],
      [createBigNumber(0.001), 0.31, 0.0015, true],
      [createBigNumber(0.003), 0.35, 0.002, true],
      [createBigNumber(0.006), 0.4, 0.003, true],
    ],
  }

  describe('price 0.19', () => {
    before(() => {
      price = 0.19
      result = nearestCompletelyFillingOrder(price, marketDepth)
    })

    it('should return an order with depth 0.006', () => {
      assert.strictEqual(result[0].toNumber(), 0.006)
    })

    it('should return the order with matching price', () => {
      assert.strictEqual(result[1], price)
    })

    it('should return an order that is selectable', () => {
      assert.isTrue(result[3])
    })

    it('should be a bid order', () => {
      assert.strictEqual(result[4], BIDS)
    })
  })

  describe('price 0.4', () => {
    before(() => {
      price = 0.4
      result = nearestCompletelyFillingOrder(price, marketDepth)
    })

    it('should return the order with matching price', () => {
      assert.strictEqual(result[1], price)
    })

    it('should return an asks order', () => {
      assert.strictEqual(result[4], ASKS)
    })
  })

  describe('undefined price', () => {
    before(() => {
      result = nearestCompletelyFillingOrder(undefined, marketDepth)
    })

    it('should return undefined', () => {
      assert.isNull(result)
    })
  })

  // for some reason the above case returned the correct 'isSelectable' values.
  // Adding another case where it does not work.
  describe('second scenario', () => {
    marketDepth = {
      bids: [
        [createBigNumber('0.001'), 0.28, 0.001, true],
        [createBigNumber('0.003'), 0.25, 0.002, true],
        [createBigNumber('0.006'), 0.19, 0.003, true],
      ],
      asks: [
        [createBigNumber('0.001'), 0.35, 0.002, false],
        [createBigNumber('0.002'), 0.35, 0.002, true],
        [createBigNumber('0.005'), 0.40, 0.003, true],
      ],
    }

    it('should work be selectable', () => {
      price = 0.35
      result = nearestCompletelyFillingOrder(price, marketDepth)

      assert.isTrue(result[3])
    })
  })


})
