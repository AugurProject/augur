import memoize from 'memoizee'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

import { createBigNumber } from 'utils/create-big-number'

const getOrderBookKeys = memoize((marketDepth, minPrice, maxPrice) => {
  let min = marketDepth[BIDS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] < p ? order[1] : p
  }, null)
  if (min === null) min = minPrice

  const mid = () => {
    if (marketDepth[ASKS].length === 0 && marketDepth[BIDS].length === 0) {
      return maxPrice.plus(minPrice).dividedBy(2)
    } else if (marketDepth[ASKS].length === 0 && marketDepth[BIDS].length > 0) {
      return createBigNumber(`${marketDepth[BIDS][0][1]}`, 10)
    } else if (marketDepth[ASKS].length > 0 && marketDepth[BIDS].length === 0) {
      return createBigNumber(`${marketDepth[ASKS][0][1]}`, 10)
    }

    return (createBigNumber(`${marketDepth[ASKS][0][1]}`, 10).plus(createBigNumber(`${marketDepth[BIDS][0][1]}`, 10))).dividedBy(2)
  }

  let max = marketDepth[ASKS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] > p ? order[1] : p
  }, null)
  if (max === null) max = maxPrice
  // make sure to use bignumbers
  min = createBigNumber(`${min}`, 10)
  max = createBigNumber(`${max}`, 10)
  // NOTE: below used to be mid().precision(15), but by casting things to strings before making them bignumbers then we shouldn't have an issue.
  return {
    min,
    mid: createBigNumber(mid()),
    max,
  }
})

export default getOrderBookKeys
