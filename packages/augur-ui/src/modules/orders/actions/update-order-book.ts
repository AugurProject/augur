import { Orderbook } from "modules/types";

export const UPDATE_ORDER_BOOK = "UPDATE_ORDER_BOOK";

export const updateOrderBook = ({ marketId, orderBook }: Orderbook) => ({
  type: UPDATE_ORDER_BOOK,
  data: {
    marketId,
    orderBook
  }
});
