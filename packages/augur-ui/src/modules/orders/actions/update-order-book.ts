import { MarketOrderBook } from "@augurproject/sdk/build/state/getter/Markets";

export const UPDATE_ORDER_BOOK = "UPDATE_ORDER_BOOK";

export const updateOrderBook = (marketId: string, orderBook: MarketOrderBook) => ({
  type: UPDATE_ORDER_BOOK,
  data: {
    marketId,
    orderBook
  }
});
