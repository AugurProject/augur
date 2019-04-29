export const UPDATE_ORDER_BOOK = "UPDATE_ORDER_BOOK";
export const UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED =
  "UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED";

export const updateOrderBook = ({ marketId, orderBook }) => ({
  type: UPDATE_ORDER_BOOK,
  data: {
    marketId,
    orderBook
  }
});
