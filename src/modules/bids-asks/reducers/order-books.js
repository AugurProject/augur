import { UPDATE_ORDER_BOOK, CLEAR_ORDER_BOOK } from 'modules/bids-asks/actions/update-order-book'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}
/**
 * @param {Object} orderBooks
 * @param {Object} action
 */
export default function (orderBooks = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ORDER_BOOK: {
      const { marketId, outcome, orderTypeLabel } = action
      const marketOrderBook = orderBooks[marketId] || {}
      const outcomeOrderBook = marketOrderBook[outcome] || {}
      return {
        ...orderBooks,
        [marketId]: {
          ...marketOrderBook,
          [outcome]: {
            ...outcomeOrderBook,
            [orderTypeLabel]: {
              ...(outcomeOrderBook[orderTypeLabel] || {}),
              ...action.orderBook,
            },
          },
        },
      }
    }
    case CLEAR_ORDER_BOOK: {
      const { marketId, outcome, orderTypeLabel } = action
      const marketOrderBook = orderBooks[marketId] || {}
      const outcomeOrderBook = marketOrderBook[outcome] || {}
      return {
        ...orderBooks,
        [marketId]: {
          ...marketOrderBook,
          [outcome]: {
            ...outcomeOrderBook,
            [orderTypeLabel]: {},
          },
        },
      }
    }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return orderBooks
  }
}
