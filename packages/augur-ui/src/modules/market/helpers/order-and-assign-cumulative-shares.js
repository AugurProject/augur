import memoize from 'memoizee'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'
import { createBigNumber } from 'src/utils/create-big-number'

const orderAndAssignCumulativeShares = memoize((orderBook) => {
  const rawBids = ((orderBook || {})[BIDS] || []).slice()
  const bids = rawBids
    .sort((a, b) => b.price.value - a.price.value)
    .reduce((p, order, i, orders) => [
      ...p,
      {
        price: order.price,
        shares: order.shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares.plus(order.shares.fullPrecision) : createBigNumber(order.shares.fullPrecision),
      },
    ], [])

  const rawAsks = ((orderBook || {})[ASKS] || []).slice()
  const asks = rawAsks
    .sort((a, b) => a.price.value - b.price.value)
    .reduce((p, order, i, orders) => [
      ...p,
      {
        price: order.price,
        shares: order.shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares.plus(order.shares.fullPrecision) : createBigNumber(order.shares.fullPrecision),
      },
    ], [])
    .sort((a, b) => b.price.value - a.price.value)

  return {
    bids,
    asks,
  }
})

export default orderAndAssignCumulativeShares
