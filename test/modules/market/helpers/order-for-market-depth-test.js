import { formatEther, formatShares } from 'src/utils/format-number'
import orderForMarketDepth from 'src/modules/market/helpers/order-for-market-depth'
import { createBigNumber } from 'src/utils/create-big-number'

describe('src/modules/market/helpers/order-for-market-depth.js', () => {
  let exampleOrderBook
  describe('when min asks depth is greater than bids', () => {
    beforeEach(() => {
      exampleOrderBook = {
        bids: [
          {
            shares: formatShares(0.001),
            price: formatEther(0.28),
            cumulativeShares: createBigNumber('0.001'),
          },
          {
            shares: formatShares(0.003),
            price: formatEther(0.4),
            cumulativeShares: createBigNumber('0.006'),
          },
        ],
        asks: [
          {
            shares: formatShares(0.002),
            price: formatEther(0.35),
            cumulativeShares: createBigNumber('0.003'),
          },
          {
            shares: formatShares(0.003),
            price: formatEther(0.4),
            cumulativeShares: createBigNumber('0.006'),
          },
        ],
      }
    })

    it('should add a starting point to asks', () => {
      const result = orderForMarketDepth(exampleOrderBook)

      assert.lengthOf(result.asks, 3)
      assert.lengthOf(result.bids, 2)

      assert.equal('0.001', result.asks[0][0].toString())
      assert.equal('0.35', result.asks[0][1])
      assert.equal('0.002', result.asks[0][2])
    })
  })

  describe('when min bid depth is greater than asks', () => {
    beforeEach(() => {
      exampleOrderBook = {
        bids: [
          {
            shares: formatShares(0.002),
            price: formatEther(0.25),
            cumulativeShares: createBigNumber('0.003'),
          },
          {
            shares: formatShares(0.003),
            price: formatEther(0.4),
            cumulativeShares: createBigNumber('0.006'),
          },
        ],
        asks: [
          {
            shares: formatShares(0.001),
            price: formatEther(0.31),
            cumulativeShares: createBigNumber('0.001'),
          },
          {
            shares: formatShares(0.003),
            price: formatEther(0.4),
            cumulativeShares: createBigNumber('0.006'),
          },
        ],
      }
    })

    it('should add a starting point to bids', () => {
      const result = orderForMarketDepth(exampleOrderBook)

      assert.lengthOf(result.asks, 2)
      assert.lengthOf(result.bids, 3)

      assert.equal('0.001', result.bids[0][0].toString())
      assert.equal('0.25', result.bids[0][1])
      assert.equal('0.002', result.bids[0][2])
    })
  })

  describe('when min bid depth is the same for bids and ask', () => {
    beforeEach(() => {
      exampleOrderBook = {
        bids: [
          {
            shares: formatShares(0.002),
            price: formatEther(0.25),
            cumulativeShares: createBigNumber('0.003'),
          },
          {
            shares: formatShares(0.003),
            price: formatEther(0.4),
            cumulativeShares: createBigNumber('0.006'),
          },
        ],
        asks: [
          {
            shares: formatShares(0.002),
            price: formatEther(0.35),
            cumulativeShares: createBigNumber('0.003'),
          },
          {
            shares: formatShares(0.003),
            price: formatEther(0.4),
            cumulativeShares: createBigNumber('0.006'),
          },
        ],
      }
    })

    it('should not add data points', () => {
      const result = orderForMarketDepth(exampleOrderBook)

      assert.lengthOf(result.asks, 2)
      assert.lengthOf(result.bids, 2)
    })
  })
})
