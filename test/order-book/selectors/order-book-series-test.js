

import orderBookSeries from 'modules/order-book/selectors/order-book-series'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

import { formatEther, formatShares } from 'utils/format-number'

describe('modules/order-book/selectors/order-book-series', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  test({
    description: 'should return an empty series for both bids + asks',
    assertions: () => {
      const actual = orderBookSeries({ [BIDS]: [], [ASKS]: [] })

      const expected = { [BIDS]: [], [ASKS]: [] }

      assert.deepEqual(actual, expected, `Didn't return the expected orderBookSeries`)
    },
  })

  test({
    description: 'should return a correctly ordered series for both bids + asks',
    assertions: () => {
      const actual = orderBookSeries({
        [BIDS]: [
          {
            price: formatEther(0.2),
            shares: formatShares(10),
          },
          {
            price: formatEther(0.1),
            shares: formatShares(10),
          },
          {
            price: formatEther(0.1),
            shares: formatShares(10),
          },
        ],
        [ASKS]: [
          {
            price: formatEther(0.5),
            shares: formatShares(10),
          },
          {
            price: formatEther(0.5),
            shares: formatShares(10),
          },
          {
            price: formatEther(0.6),
            shares: formatShares(10),
          },
        ],
      })

      const expected = {
        [BIDS]: [
          [0.1, 30],
          [0.2, 10],
        ],
        [ASKS]: [
          [0.5, 20],
          [0.6, 30],
        ],
      }

      assert.deepEqual(actual, expected, `Didn't return the expected orderBookSeries`)
    },
  })
})
