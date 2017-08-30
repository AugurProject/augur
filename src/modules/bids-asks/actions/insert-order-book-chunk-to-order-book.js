import { updateOrderBook } from 'modules/bids-asks/actions/update-order-book'
import clearOrderBookOnFirstChunk from 'modules/bids-asks/actions/clear-order-book-on-first-chunk'

const insertOrderBookChunkToOrderBook = (marketID, outcome, orderTypeLabel, orderBookChunk) => (dispatch) => {
  dispatch(clearOrderBookOnFirstChunk(marketID, outcome, orderTypeLabel))
  dispatch(updateOrderBook(marketID, outcome, orderTypeLabel, orderBookChunk))
}

export default insertOrderBookChunkToOrderBook
