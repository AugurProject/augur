import { Getters } from "@augurproject/sdk";

export const UPDATE_ORDER_BOOK = "UPDATE_ORDER_BOOK";

export const updateOrderBook = (marketId: string, orderBook: Getters.Markets.OutcomeOrderBook) => ({
  type: UPDATE_ORDER_BOOK,
  data: {
    marketId,
    orderBook
  }
});
