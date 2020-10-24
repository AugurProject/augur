
import { RESET_STATE } from "modules/app/actions/reset-state";
import { BaseAction, OrderBooks } from "modules/types";
import { UPDATE_ORDER_BOOK, CLEAR_ORDER_BOOK, UPDATE_INVALID_BIDS } from "modules/orders/actions/load-market-orderbook";
import { BIDS } from "modules/common/constants";

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
    case UPDATE_INVALID_BIDS:
      const { marketId, orderBook } = data;
      // delete invalid outcome, only need bids, orderbook totally gets replaced if user nav to market trading page.
      if (orderBooks[marketId] && delete orderBooks[marketId][0]) {
        delete orderBooks[marketId][0];
      }
      return {
        ...orderBooks,
        [marketId]: {
          ...orderBooks[marketId],
          orderBook,
        }
      };
    case CLEAR_ORDER_BOOK:
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return orderBooks;
  }
}
