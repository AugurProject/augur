import memoize from 'memoizee'

import { has } from 'lodash'

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
  if (!has(orderBooks, [marketID, outcome, orderTypeLabel])) return null
  return orderBooks[marketID][outcome][orderTypeLabel] || null
}, { max: 1 })
