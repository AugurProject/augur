import memoize from 'memoizee'
import selectOrderBook from 'modules/bids-asks/selectors/select-order-book'

export default function (orderID, marketID, outcome, orderTypeLabel, orderBooks) {
  return getOrder(orderID, marketID, outcome, orderTypeLabel, orderBooks)
}

/**
 * @param {String} orderID
 * @param {String} marketID
 * @param {int} outcome
 * @param {String} orderTypeLabel
 * @param {Object} orderBooks
 * @return {Object|null}
 */
const getOrder = memoize((orderID, marketID, outcome, orderTypeLabel, orderBooks) => {
  const orderBook = selectOrderBook(marketID, outcome, orderTypeLabel, orderBooks)
  if (orderBook == null) return null
  return orderBook[orderID] || null
}, { max: 1 })
