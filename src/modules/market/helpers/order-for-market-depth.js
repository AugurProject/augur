import memoize from 'memoizee'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

const orderForMarketDepth = memoize((orderBook) => {
  const rawBids = ((orderBook || {})[BIDS] || []).slice()
  const bids = rawBids
    .reduce((p, order) => [...p, [order.cumulativeShares, order.price.value, order.shares.value]], [])
  const rawAsks = ((orderBook || {})[ASKS] || []).slice()
  const asks = rawAsks
    .sort((a, b) => a.price.value - b.price.value)
    .reduce((p, order) => [...p, [order.cumulativeShares, order.price.value, order.shares.value]], [])

  return {
    [BIDS]: bids,
    [ASKS]: asks,
  }
})

export default orderForMarketDepth
