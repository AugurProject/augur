import { clearMarketOrderBook, updateIsFirstOrderBookChunkLoaded } from 'modules/bids-asks/actions/update-market-order-book';

const clearOrderBookOnFirstChunk = marketID => (dispatch, getState) => {
  const { isFirstOrderBookChunkLoaded } = getState();
  if (!isFirstOrderBookChunkLoaded[marketID]) {
    console.log('first chunk, clearing order book of', marketID);
    dispatch(updateIsFirstOrderBookChunkLoaded(marketID, true));
    dispatch(clearMarketOrderBook(marketID));
  }
};

export default clearOrderBookOnFirstChunk;
