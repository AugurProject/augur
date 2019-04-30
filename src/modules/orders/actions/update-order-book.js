export const UPDATE_ORDER_BOOK = "UPDATE_ORDER_BOOK";

export const updateOrderBook = ({ marketId, orderBook }) => ({
  type: UPDATE_ORDER_BOOK,
  data: {
    marketId,
    orderBook
  }
});
