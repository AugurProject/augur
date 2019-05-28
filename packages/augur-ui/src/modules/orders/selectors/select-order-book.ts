import memoize from "memoizee";

import { has } from "lodash";

export default function(marketId, outcome, orderTypeLabel, orderBooks) {
  return getOrderBook(marketId, outcome, orderTypeLabel, orderBooks);
}

/**
 * @param {string} marketId
 * @param {int} outcome
 * @param {string} orderTypeLabel
 * @param {Object} orderBooks
 * @return {Object|null}
 */
const getOrderBook = memoize(
  (marketId, outcome, orderTypeLabel, orderBooks) => {
    if (!has(orderBooks, [marketId, outcome, orderTypeLabel])) return null;
    return orderBooks[marketId][outcome][orderTypeLabel] || null;
  },
  { max: 1 }
);
