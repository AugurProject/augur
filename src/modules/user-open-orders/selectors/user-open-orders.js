import memoize from 'memoizee'
import BigNumber from 'bignumber.js'
import speedomatic from 'speedomatic'

import store from 'src/store'

import { isOrderOfUser } from 'modules/bids-asks/helpers/is-order-of-user'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status'

import { formatNone, formatEtherTokens, formatShares } from 'utils/format-number'

export function selectAllUserOpenOrderMarkets() {
  const { loginAccount, orderBooks } = store.getState()

  if (!loginAccount.address || orderBooks == null) {
    return []
  }

  return Object.keys(orderBooks)
    .filter(marketID => Object.keys(orderBooks[marketID])
      .filter(outcome => Object.keys(orderBooks[marketID][outcome])
        .filter(type => Object.keys(orderBooks[marketID][outcome][type])
          .filter(hash => orderBooks[marketID][outcome][type][hash].owner === loginAccount.address))))
}

/**
 * Pulls off existing order book in state
 * @param {String} outcomeId
 * @param {String} marketID
 *
 * @return {Array}
 */
export function selectUserOpenOrders(outcomeId, marketID) {
  const { loginAccount, orderCancellation, orderBooks } = store.getState()
  if (!loginAccount.address || orderBooks == null || orderBooks[marketID] == null) return []
  const marketOrderBook = orderBooks[marketID]
  return userOpenOrders(outcomeId, loginAccount, marketOrderBook, orderCancellation, marketID)
}

/**
 * Orders are sorted: asks then bids. By price in descending order
 *
 * @param {String} outcomeID
 * @param {Object} loginAccount
 * @param {{buy: object, sell: object}} marketOrderBook
 *
 * @return {Array}
 */
const userOpenOrders = memoize((outcomeID, loginAccount, marketOrderBook, orderCancellation, marketID) => {
  const orderData = marketOrderBook[outcomeID]

  const userBids = (orderData == null || orderData.buy == null) ? [] : getUserOpenOrders(marketOrderBook[outcomeID], BUY, outcomeID, loginAccount.address, orderCancellation, marketID)
  const userAsks = (orderData == null || orderData.sell == null) ? [] : getUserOpenOrders(marketOrderBook[outcomeID], SELL, outcomeID, loginAccount.address, orderCancellation, marketID)

  return userAsks.concat(userBids)
}, { max: 10 })

/**
 * Returns user's order for specified outcome sorted by price
 *
 * @param {Object} orders
 * @param {String} orderType
 * @param {String} outcomeID
 * @param {String} userID
 * @param {Object} orderCancellation
 *
 * @return {Array}
 */
function getUserOpenOrders(orders, orderType, outcomeID, userID, orderCancellation, marketID) {
  const typeOrders = orders[orderType]
  return Object.keys(typeOrders)
    .map(orderId => typeOrders[orderId])
    .filter(order => isOrderOfUser(order, userID) && orderCancellation[order.id] !== CLOSE_DIALOG_CLOSING)
    .sort((order1, order2) => new BigNumber(order2.price, 10).comparedTo(new BigNumber(order1.price, 10)))
    .map(order => (
      {
        id: order.orderID,
        marketID: speedomatic.formatInt256(marketID),
        type: orderType,
        originalShares: formatNone(),
        avgPrice: formatEtherTokens(order.price),
        matchedShares: formatNone(),
        unmatchedShares: formatShares(order.amount)
      }
    ))
}
