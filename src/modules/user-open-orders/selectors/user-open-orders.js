import memoize from 'memoizee'
import BigNumber from 'bignumber.js'

import store from 'src/store'

import { isOrderOfUser } from 'modules/bids-asks/helpers/is-order-of-user'

import { BUY, SELL } from 'modules/transactions/constants/types'

import { formatNone, formatEtherTokens, formatShares } from 'utils/format-number'
import { cancelOrder } from 'modules/bids-asks/actions/cancel-order'
/**
 * Pulls off existing order book in state
 * @param {String} outcomeId
 * @param {String} marketID
 *
 * @return {Array}
 */
export function selectUserOpenOrders(marketId, outcomeId, marketOrderBook) {
  const { loginAccount } = store.getState()
  if (!loginAccount.address || marketOrderBook == null) return []

  return userOpenOrders(marketId, outcomeId, loginAccount, marketOrderBook)
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
const userOpenOrders = memoize((marketId, outcomeID, loginAccount, marketOrderBook) => {
  const orderData = marketOrderBook[outcomeID]

  const userBids = (orderData == null || orderData.buy == null) ? [] : getUserOpenOrders(marketId, marketOrderBook[outcomeID], BUY, outcomeID, loginAccount.address)
  const userAsks = (orderData == null || orderData.sell == null) ? [] : getUserOpenOrders(marketId, marketOrderBook[outcomeID], SELL, outcomeID, loginAccount.address)

  return userAsks.concat(userBids)
}, { max: 10 })

/**
 * Returns user's order for specified outcome sorted by price
 *
 * @param {Object} orders
 * @param {String} orderType
 * @param {String} outcomeID
 * @param {String} userID
 *
 * @return {Array}
 */
function getUserOpenOrders(marketId, orders, orderType, outcomeID, userID) {
  const typeOrders = orders[orderType]
  return Object.keys(typeOrders)
    .map(orderId => typeOrders[orderId])
    .filter(order => isOrderOfUser(order, userID))
    .sort((order1, order2) => new BigNumber(order2.price, 10).comparedTo(new BigNumber(order1.price, 10)))
    .map(order => (
      {
        id: order.orderID,
        type: orderType,
        marketId,
        outcomeID,
        originalShares: formatNone(),
        avgPrice: formatEtherTokens(order.price),
        matchedShares: formatNone(),
        unmatchedShares: formatShares(order.amount),
        cancelOrder: (orderID, marketID, outcome, type) => {
          store.dispatch(cancelOrder(orderID, marketID, outcome, type))
        }
      }
    ))
}
