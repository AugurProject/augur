import { UPDATE_MARKET_ORDER_BOOK, REPLACE_MARKET_ORDER_BOOK, CLEAR_MARKET_ORDER_BOOK } from 'modules/bids-asks/actions/update-market-order-book'

/**
 * @param {Object} orderBooks
 * @param {Object} action
 * @return {{}} key: marketID, value: {buy: {}, sell: {}}
 */
export default function (orderBooks = {}, action) {
  switch (action.type) {
    case UPDATE_MARKET_ORDER_BOOK: {
      const orderBook = orderBooks[action.marketID] || {}
      return {
        ...orderBooks,
        [action.marketID]: {
          buy: (orderBook.buy)
            ? { ...orderBook.buy, ...action.marketOrderBook.buy }
            : action.marketOrderBook.buy,
          sell: (orderBook.sell)
            ? { ...orderBook.sell, ...action.marketOrderBook.sell }
            : action.marketOrderBook.sell
        }
      }
    }
    case REPLACE_MARKET_ORDER_BOOK:
      return {
        ...orderBooks,
        [action.marketID]: action.marketOrderBook
      }
    case CLEAR_MARKET_ORDER_BOOK:
      return {
        ...orderBooks,
        [action.marketID]: { buy: {}, sell: {} }
      }
    default:
      return orderBooks
  }
}
