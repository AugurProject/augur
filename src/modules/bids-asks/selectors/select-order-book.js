import memoize from 'memoizee'

export default function (marketID, outcome, orderTypeLabel, orderBooks) {
  return getOrderBook(marketID, outcome, orderTypeLabel, orderBooks)
}

/**
 * @param {String} marketID
 * @param {int} outcome
 * @param {String} orderTypeLabel
 * @param {Object} orderBooks
 * @return {Object|null}
 */
const getOrderBook = memoize((marketID, outcome, orderTypeLabel, orderBooks) => {
  if (orderBooks[marketID] == null) return null
  if (orderBooks[marketID][outcome] == null) return null
  return orderBooks[marketID][outcome][orderTypeLabel] || null
}, { max: 1 })
