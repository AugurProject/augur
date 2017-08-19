import { updateMarketOrderBook } from 'modules/bids-asks/actions/update-market-order-book';
import clearOrderBookOnFirstChunk from 'modules/bids-asks/actions/clear-order-book-on-first-chunk';

const insertOrderBookChunkToOrderBook = (marketID, orderBookChunk) => (dispatch) => {
  dispatch(clearOrderBookOnFirstChunk(marketID));
  dispatch(updateMarketOrderBook(marketID, orderBookChunk));
};

export default insertOrderBookChunkToOrderBook;
