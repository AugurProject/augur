import { updateOrderBook } from 'modules/bids-asks/actions/update-order-book'
import clearOrderBookOnFirstChunk from 'modules/bids-asks/actions/clear-order-book-on-first-chunk'

const insertOrderBookChunkToOrderBook = (marketId, outcome, orderTypeLabel, orderBookChunk) => (dispatch) => {
  dispatch(clearOrderBookOnFirstChunk(marketId, outcome, orderTypeLabel))
  dispatch(updateOrderBook(marketId, outcome, orderTypeLabel, orderBookChunk))
}

export default insertOrderBookChunkToOrderBook
