import memoize from 'memoizee'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

const getOrderBookKeys = memoize((marketDepth) => {
  const min = marketDepth[BIDS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] < p ? order[1] : p
  }, null)

  const mid = () => {
    if (marketDepth[ASKS].length === 0 && marketDepth[BIDS].length === 0) {
      return null
    } else if (marketDepth[ASKS].length === 0 && marketDepth[BIDS].length > 0) {
      return marketDepth[BIDS][0][1]
    } else if (marketDepth[ASKS].length > 0 && marketDepth[BIDS].length === 0) {
      return marketDepth[ASKS][0][1]
    }

    return (marketDepth[ASKS][0][1] + marketDepth[BIDS][0][1]) / 2
  }

  const max = marketDepth[ASKS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] > p ? order[1] : p
  }, null)

  return {
    min,
    mid: mid(),
    max,
  }
})

export default getOrderBookKeys
