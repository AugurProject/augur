import memoize from "memoizee";
import selectOrderBook from "modules/orders/selectors/select-order-book";

export default function(
  orderId,
  marketId,
  outcome,
  orderTypeLabel,
  orderBooks,
) {
  return getOrder(orderId, marketId, outcome, orderTypeLabel, orderBooks);
}

/**
 * @param {string} orderId
 * @param {string} marketId
 * @param {int} outcome
 * @param {string} orderTypeLabel
 * @param {Object} orderBooks
 * @return {Object|null}
 */
const getOrder = memoize(
  (orderId, marketId, outcome, orderTypeLabel, orderBooks) => {
    const orderBook = selectOrderBook(
      marketId,
      outcome,
      orderTypeLabel,
      orderBooks,
    );
    if (orderBook == null) return null;
    return orderBook[orderId] || null;
  },
  { max: 1 },
);
