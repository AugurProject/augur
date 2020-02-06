
import { RESET_STATE } from "modules/app/actions/reset-state";
import { BaseAction, OrderBooks } from "modules/types";
import { UPDATE_ORDER_BOOK, CLEAR_ORDER_BOOK } from "modules/orders/actions/load-market-orderbook";

const DEFAULT_STATE: OrderBooks = {};
/**
 * @param {Object} orderBooks
 * @param {Object} action
 */
export default function(orderBooks = DEFAULT_STATE, { type, data }: BaseAction): OrderBooks {
  switch (type) {
    case UPDATE_ORDER_BOOK: {
      const { marketId, orderBook } = data;
      return {
        [marketId]: orderBook,
      };
    }
    case CLEAR_ORDER_BOOK:
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return orderBooks;
  }
}
