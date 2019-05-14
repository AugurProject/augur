export const UPDATE_ORDER_BOOK = "UPDATE_ORDER_BOOK";

export const updateOrderBook = ({ marketId, orderBook }: any) => ({
  type: UPDATE_ORDER_BOOK,
  data: {
    marketId,
    orderBook
  }
});
