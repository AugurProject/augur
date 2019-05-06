import { UPDATE_ORDER_BOOK } from "modules/orders/actions/update-order-book";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};
/**
 * @param {Object} orderBooks
 * @param {Object} action
 */
export default function(orderBooks = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_ORDER_BOOK: {
      const { marketId, orderBook } = data;
      const newOrderBooks = Object.keys(orderBooks).reduce(
        (p, m) => (m !== marketId ? { ...p, [m]: orderBooks[m] } : p),
        {}
      );
      return {
        ...newOrderBooks,
        [marketId]: orderBook
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return orderBooks;
  }
}
