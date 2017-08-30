import { UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED } from 'modules/bids-asks/actions/update-order-book'

export default function (isFirstOrderBookChunkLoaded = {}, action) {
  switch (action.type) {
    case UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED:
      return {
        ...isFirstOrderBookChunkLoaded,
        [action.marketID]: {
          ...(isFirstOrderBookChunkLoaded[action.marketID] || {}),
          [action.outcome]: {
            ...((isFirstOrderBookChunkLoaded[action.marketID] || {})[action.outcome] || {}),
            [action.orderTypeLabel]: action.isLoaded
          }
        }
      }
    default:
      return isFirstOrderBookChunkLoaded
  }
}
