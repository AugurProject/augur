import memoize from 'memoizee'
import BigNumber from 'bignumber.js'
import speedomatic from 'speedomatic'

import store from 'src/store'

import { isOrderOfUser } from 'modules/bids-asks/helpers/is-order-of-user'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status'

import { formatNone, formatEtherTokens, formatShares } from 'utils/format-number'

/**
 *
 * @param {String} outcomeId
 * @param {{buy: object, sell: object}} marketOrderBook
 *
 * @return {Array}
 */
export default function (outcomeId, marketOrderBook) {
  const { loginAccount, orderCancellation } = store.getState()

  return selectUserOpenOrders(outcomeId, loginAccount, marketOrderBook, orderCancellation)
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
const selectUserOpenOrders = memoize((outcomeID, loginAccount, marketOrderBook, orderCancellation) => {
  const isUserLoggedIn = loginAccount.address != null

  if (!isUserLoggedIn || marketOrderBook == null) {
    return []
  }

  const userBids = marketOrderBook.buy == null ? [] : getUserOpenOrders(marketOrderBook.buy, BUY, outcomeID, loginAccount.address, orderCancellation)

  const userAsks = marketOrderBook.sell == null ? [] : getUserOpenOrders(marketOrderBook.sell, SELL, outcomeID, loginAccount.address, orderCancellation)

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
function getUserOpenOrders(orders, orderType, outcomeID, userID, orderCancellation) {
  return Object.keys(orders)
    .map(orderId => orders[orderId])
    .filter(order => order.outcome === outcomeID && isOrderOfUser(order, userID) && orderCancellation[order.id] !== CLOSE_DIALOG_CLOSING)
    .sort((order1, order2) => new BigNumber(order2.price, 10).comparedTo(new BigNumber(order1.price, 10)))
    .map(order => (
      {
        id: order.id,
        marketID: speedomatic.formatInt256(order.market),
        type: orderType,
        originalShares: formatNone(),
        avgPrice: formatEtherTokens(order.price),
        matchedShares: formatNone(),
        unmatchedShares: formatShares(order.amount)
      }
    ))
}
