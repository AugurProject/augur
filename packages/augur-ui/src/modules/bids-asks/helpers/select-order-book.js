import { createBigNumber } from 'utils/create-big-number'
import memoize from 'memoizee'

import store from 'src/store'

import { ZERO } from 'modules/trade/constants/numbers'
import { isOrderOfUser } from 'modules/bids-asks/helpers/is-order-of-user'

import { BIDS, ASKS, CANCELED } from 'modules/order-book/constants/order-book-order-types'
import { BUY, SELL } from 'modules/trade/constants/types'
import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status'

import { has } from 'lodash'

import { formatShares, formatEther } from 'utils/format-number'

/**
 * @param {String} outcomeId
 * @param {Object} marketOrderBook
 */
export const selectAggregateOrderBook = memoize((outcomeId, marketOrderBook, orderCancellation) => {
  if (marketOrderBook == null) {
    return {
      [BIDS]: [],
      [ASKS]: [],
    }
  }

  return {
    [BIDS]: selectAggregatePricePoints(outcomeId, BUY, marketOrderBook, orderCancellation).sort(sortPricePointsByPriceDesc),
    [ASKS]: selectAggregatePricePoints(outcomeId, SELL, marketOrderBook, orderCancellation).sort(sortPricePointsByPriceAsc),
  }
}, { max: 100 })

export const selectTopBid = memoize((marketOrderBook, excludeCurrentUser) => {
  let topBid
  if (excludeCurrentUser) {
    const numBids = marketOrderBook.bids.length
    if (numBids) {
      for (let i = 0; i < numBids; ++i) {
        if (!marketOrderBook.bids[i].isOfCurrentUser) {
          topBid = marketOrderBook.bids[i]
          break
        }
      }
    }
  } else {
    topBid = marketOrderBook.bids[0]
  }
  return topBid != null ? topBid : null
}, { max: 10 })

export const selectTopAsk = memoize((marketOrderBook, excludeCurrentUser) => {
  let topAsk
  if (excludeCurrentUser) {
    const numAsks = marketOrderBook.asks.length
    if (numAsks) {
      for (let i = 0; i < numAsks; ++i) {
        if (!marketOrderBook.asks[i].isOfCurrentUser) {
          topAsk = marketOrderBook.asks[i]
          break
        }
      }
    }
  } else {
    topAsk = marketOrderBook.asks[0]
  }
  return topAsk != null ? topAsk : null
}, { max: 10 })

/**
 * Selects price points with aggregated amount of shares
 *
 * @param {String} outcomeId
 * @param {String} side
 * @param {{String, Object}} orders Key is order ID, value is order
 */
const selectAggregatePricePoints = memoize((outcomeId, side, orders, orderCancellation) => {
  if (orders == null || !has(orders, [outcomeId, side])) {
    return []
  }
  const currentUserAddress = store.getState().loginAccount.address

  const shareCountPerPrice = Object.keys(orders[outcomeId][side])
    .map(orderId => orders[outcomeId][side][orderId])
    .filter(order => orderCancellation[order.orderId] !== CLOSE_DIALOG_CLOSING)
    .filter(order => order.orderState !== CANCELED)
    .map(order => ({
      ...order,
      isOfCurrentUser: isOrderOfUser(order, currentUserAddress),
    }))
    .reduce(reduceSharesCountByPrice, {})

  return Object.keys(shareCountPerPrice)
    .map((price) => {
      const obj = {
        isOfCurrentUser: shareCountPerPrice[price].isOfCurrentUser,
        shares: formatShares(shareCountPerPrice[price].shares),
        price: formatEther(price),
        sharesEscrowed: formatShares(shareCountPerPrice[price].sharesEscrowed),
        tokensEscrowed: formatEther(shareCountPerPrice[price].tokensEscrowed),
      }
      return obj
    })
}, { max: 100 })

/**
 * @param {Object} aggregateOrdersPerPrice
 * @param order
 * @return {Object} aggregateOrdersPerPrice
 */
function reduceSharesCountByPrice(aggregateOrdersPerPrice, order) {
  if (order && !isNaN(order.fullPrecisionPrice) && !isNaN(order.fullPrecisionAmount)) {
    const key = createBigNumber(order.fullPrecisionPrice, 10).toFixed()
    if (aggregateOrdersPerPrice[key] == null) {
      aggregateOrdersPerPrice[key] = {
        shares: ZERO,
        sharesEscrowed: ZERO,
        tokensEscrowed: ZERO,
        isOfCurrentUser: false,
      }
    }
    aggregateOrdersPerPrice[key].shares = aggregateOrdersPerPrice[key].shares.plus(createBigNumber(order.fullPrecisionAmount, 10))
    aggregateOrdersPerPrice[key].sharesEscrowed = aggregateOrdersPerPrice[key].sharesEscrowed.plus(createBigNumber(order.sharesEscrowed || 0, 10))
    aggregateOrdersPerPrice[key].tokensEscrowed = aggregateOrdersPerPrice[key].tokensEscrowed.plus(createBigNumber(order.tokensEscrowed || 0, 10))
    aggregateOrdersPerPrice[key].isOfCurrentUser = aggregateOrdersPerPrice[key].isOfCurrentUser || order.isOfCurrentUser // TODO -- we need to segregate orders @ the same price that are of user
  } else {
    console.debug('reduceSharesCountByPrice:', order)
  }
  return aggregateOrdersPerPrice
}

function sortPricePointsByPriceAsc(pricePoint1, pricePoint2) {
  return pricePoint1.price.value - pricePoint2.price.value
}

function sortPricePointsByPriceDesc(pricePoint1, pricePoint2) {
  return pricePoint2.price.value - pricePoint1.price.value
}
