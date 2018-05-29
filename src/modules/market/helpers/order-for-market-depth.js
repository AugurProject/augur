import memoize from 'memoizee'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

const orderForMarketDepth = (orderBook) => {
  const rawBids = ((orderBook || {})[BIDS] || []).slice()
  const bids = rawBids
    .reduce((p, order) => [...p, [order.cumulativeShares, order.price.value, order.shares.value]], [])
  const rawAsks = ((orderBook || {})[ASKS] || []).slice()
  const asks = rawAsks
    .sort((a, b) => a.price.value - b.price.value)
    .reduce((p, order) => [...p, [order.cumulativeShares, order.price.value, order.shares.value]], [])

  // no need to add an starting data point if one side is empty.
  if (asks.length === 0 || bids.length === 0) {
    return {
      [BIDS]: bids,
      [ASKS]: asks,
    }
  }

  const minAsksDepthOrder = asks.reduce((lastValue, nextValue) => (lastValue[0].lte(nextValue[0]) ? lastValue : nextValue), asks[0])
  const minBidDepthOrder = bids.reduce((lastValue, nextValue) => (lastValue[0].lte(nextValue[0]) ? lastValue : nextValue), bids[0])

  // depth is the same.
  switch (true) {
    // need to add a starting bid order
    case minAsksDepthOrder[0].lt(minBidDepthOrder[0]):
      bids.unshift([minAsksDepthOrder[0], minBidDepthOrder[1], minBidDepthOrder[2]])
      break
    // need to add a starting ask order
    case minAsksDepthOrder[0].gt(minBidDepthOrder[0]):
      asks.unshift([minBidDepthOrder[0], minAsksDepthOrder[1], minAsksDepthOrder[2]])
      break
    default:
      // do nothing
  }

  return {
    [BIDS]: bids,
    [ASKS]: asks,
  }
}

export default memoize(orderForMarketDepth)
