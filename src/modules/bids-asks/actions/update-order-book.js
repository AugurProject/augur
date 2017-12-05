export const UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK'
export const REPLACE_ORDER_BOOK = 'REPLACE_ORDER_BOOK'
export const CLEAR_ORDER_BOOK = 'CLEAR_ORDER_BOOK'
export const UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED = 'UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED'

export const updateOrderBook = (marketID, outcome, orderTypeLabel, orderBook) => (
  {
    type: UPDATE_ORDER_BOOK, marketID, outcome, orderTypeLabel, orderBook
  }
)
export const replaceOrderBook = (marketID, outcome, orderTypeLabel, orderBook) => (
  {
    type: REPLACE_ORDER_BOOK, marketID, outcome, orderTypeLabel, orderBook
  }
)
export const clearOrderBook = (marketID, outcome, orderTypeLabel) => (
  {
    type: CLEAR_ORDER_BOOK, marketID, outcome, orderTypeLabel
  }
)
export const updateIsFirstOrderBookChunkLoaded = (marketID, outcome, orderTypeLabel, isLoaded) => (
  {
    type: UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED, marketID, outcome, orderTypeLabel, isLoaded
  }
)
