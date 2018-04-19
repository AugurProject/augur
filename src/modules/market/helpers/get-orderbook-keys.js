import memoize from 'memoizee'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

import { createBigNumber } from 'utils/create-big-number'

const getOrderBookKeys = memoize((marketDepth, minPrice, maxPrice) => {
  if (marketDepth.asks.length === 0 && marketDepth.bids.length === 0) return { min: 0, mid: createBigNumber(0), max: 0 }
  const bnMinPrice = createBigNumber(minPrice)
  const bnMaxPrice = createBigNumber(maxPrice)
  let min = marketDepth[BIDS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] < p ? order[1] : p
  }, null)
  if (min === null) min = minPrice

  const mid = () => {
    if (marketDepth[ASKS].length === 0 && marketDepth[BIDS].length === 0) {
      return bnMaxPrice.plus(bnMinPrice).dividedBy(2)
    } else if (marketDepth[ASKS].length === 0 && marketDepth[BIDS].length > 0) {
      return marketDepth[BIDS][0][1]
    } else if (marketDepth[ASKS].length > 0 && marketDepth[BIDS].length === 0) {
      return marketDepth[ASKS][0][1]
    }

    return (marketDepth[ASKS][0][1] + marketDepth[BIDS][0][1]) / 2
  }

  let max = marketDepth[ASKS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] > p ? order[1] : p
  }, null)
  if (max === null) max = maxPrice

  return {
    min,
    mid: createBigNumber(mid().toPrecision(15)), // NOTE -- `toPrecision` is there to prevent the BN issue w/ numbers that have more than 15 sigfigs
    max,
  }
})

export default getOrderBookKeys
