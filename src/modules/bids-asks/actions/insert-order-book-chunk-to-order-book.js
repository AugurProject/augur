import { updateMarketOrderBook } from 'modules/bids-asks/actions/update-market-order-book';
import { clearOrderBookOnFirstChunk } from 'modules/bids-asks/actions/clear-order-book-on-first-chunk';

export const insertOrderBookChunkToOrderBook = (marketID, orderBookChunk) => (dispatch) => {
  console.log('order book chunk:', marketID, orderBookChunk);
  dispatch(clearOrderBookOnFirstChunk(marketID));
  dispatch(updateMarketOrderBook(marketID, orderBookChunk));
};
