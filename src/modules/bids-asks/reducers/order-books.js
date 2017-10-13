import { UPDATE_ORDER_BOOK, REPLACE_ORDER_BOOK, CLEAR_ORDER_BOOK } from 'modules/bids-asks/actions/update-order-book'

/**
 * @param {Object} orderBooks
 * @param {Object} action
 */
export default function (orderBooks = {}, action) {
  switch (action.type) {
    case UPDATE_ORDER_BOOK: {
      const marketID = action.marketID
      const outcome = action.outcome
      const orderTypeLabel = action.orderTypeLabel
      const marketOrderBook = orderBooks[marketID] || {}
      const outcomeOrderBook = marketOrderBook[outcome] || {}
      return {
        ...orderBooks,
        [marketID]: {
          ...marketOrderBook,
          [outcome]: {
            ...outcomeOrderBook,
            [orderTypeLabel]: {
              ...(outcomeOrderBook[orderTypeLabel] || {}),
              ...action.orderBook
            }
          }
        }
      }
    }
    case REPLACE_ORDER_BOOK: {
      const marketID = action.marketID
      const outcome = action.outcome
      const orderTypeLabel = action.orderTypeLabel
      const marketOrderBook = orderBooks[marketID] || {}
      const outcomeOrderBook = marketOrderBook[outcome] || {}
      return {
        ...orderBooks,
        [marketID]: {
          ...marketOrderBook,
          [outcome]: {
            ...outcomeOrderBook,
            [orderTypeLabel]: action.orderBook
          }
        }
      }
    }
    case CLEAR_ORDER_BOOK: {
      const marketID = action.marketID
      const outcome = action.outcome
      const orderTypeLabel = action.orderTypeLabel
      const marketOrderBook = orderBooks[marketID] || {}
      const outcomeOrderBook = marketOrderBook[outcome] || {}
      return {
        ...orderBooks,
        [marketID]: {
          ...marketOrderBook,
          [outcome]: {
            ...outcomeOrderBook,
            [orderTypeLabel]: {}
          }
        }
      }
    }
    default:
      return orderBooks
  }
}
