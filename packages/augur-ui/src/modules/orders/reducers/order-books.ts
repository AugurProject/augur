import { UPDATE_ORDER_BOOK } from "modules/orders/actions/update-order-book";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { OrderBooks, BaseAction } from "modules/types";

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
        ...orderBooks,
        [marketId]: orderBook,
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return orderBooks;
  }
}
