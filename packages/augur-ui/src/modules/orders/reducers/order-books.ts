import { UPDATE_ORDER_BOOK } from "modules/orders/actions/update-order-book";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { Orderbooks, BaseAction } from "modules/types";

const DEFAULT_STATE: Orderbooks = {};
/**
 * @param {Object} orderBooks
 * @param {Object} action
 */
export default function(orderBooks = DEFAULT_STATE, { type, data }: BaseAction) {
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
