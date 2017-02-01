import { augur } from '../../../services/augurjs';
import { SCALAR } from '../../markets/constants/market-types';
import { clearMarketOrderBook, updateMarketOrderBook } from '../../bids-asks/actions/update-market-order-book';

export const loadBidsAsks = (marketID, cb) => (dispatch, getState) => {
  const callback = cb || (e => console.log('loadBidsAsks:', e));
  const market = getState().marketsData[marketID];
  const scalarMinMax = {};
  if (market.type === SCALAR) {
    scalarMinMax.minValue = market.minValue;
    scalarMinMax.maxValue = market.maxValue;
  }
  let firstChunkLoaded;
  augur.getOrderBookChunked(marketID, 0, null, scalarMinMax, null, (orderBookChunk) => {
    console.log('order book chunk:', marketID, orderBookChunk);
    if (!firstChunkLoaded) {
      firstChunkLoaded = true;
      console.log('first chunk, clearing order book...');
      dispatch(clearMarketOrderBook(marketID));
    }
    dispatch(updateMarketOrderBook(marketID, orderBookChunk));
  }, callback);
};
