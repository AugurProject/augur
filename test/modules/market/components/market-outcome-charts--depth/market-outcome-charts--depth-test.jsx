import { nearestCompletelyFillingOrder } from 'src/modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth'

import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'

describe('src/modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth.jsx', () => {
  let price
  let result

  // depth, price, qty
  const marketDepth = {
    bids: [
      [0.001, 0.28, 0.001],
      [0.003, 0.25, 0.002],
      [0.006, 0.19, 0.003],
    ],
    asks: [
      [0.001, 0.31, 0.001],
      [0.003, 0.35, 0.002],
      [0.006, 0.4, 0.003],
    ],
  }

  describe('price 0.19', () => {
    before(() => {
      price = 0.19
      result = nearestCompletelyFillingOrder(price, marketDepth)
      console.log(result)
    })

    it('should return the order with matching price', () => {
      assert.equal(result[1], 0.19)
    })

    it('should be a bid order', () => {
      assert.equal(result[3], BIDS)
    })
  })

  describe('price 0.4', () => {
    before(() => {
      price = 0.4
      result = nearestCompletelyFillingOrder(price, marketDepth)
    })

    it('should return the order with matching price', () => {
      assert.equal(result[1], price)
    })

    it('should return an asks order', () => {
      assert.equal(result[3], ASKS)
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
})
