import { UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED } from 'modules/bids-asks/actions/update-market-order-book';

export default function (isFirstOrderBookChunkLoaded = {}, action) {
  switch (action.type) {
    case UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED:
      return {
        ...isFirstOrderBookChunkLoaded,
        [action.marketID]: action.isLoaded
      };
    default:
      return isFirstOrderBookChunkLoaded;
  }
}
