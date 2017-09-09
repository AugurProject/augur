import { augur } from 'services/augurjs';
import { BUY } from 'modules/transactions/constants/types';
import { updateIsFirstOrderBookChunkLoaded } from 'modules/bids-asks/actions/update-order-book';
import insertOrderBookChunkToOrderBook from 'modules/bids-asks/actions/insert-order-book-chunk-to-order-book';
import logError from 'utils/log-error';

const loadOneOutcomeBidsOrAsks = (marketID, outcome, orderTypeLabel, callback = logError) => (dispatch, getState) => {
  const { marketsData } = getState();
  if (marketID == null || outcome == null || orderTypeLabel == null) {
    return callback(`must specify market ID, outcome, and order type: ${marketID} ${outcome} ${orderTypeLabel}`);
  }
  const market = marketsData[marketID];
  if (!market) {
    return callback(`market ${marketID} data not found`);
  }
  if (market.minPrice == null || market.maxPrice == null) {
    return callback(`minPrice and maxPrice not found for market ${marketID}: ${market.minPrice} ${market.maxPrice}`);
  }
  const orderType = (orderTypeLabel === BUY) ? 1: 2;
  augur.api.Orders.getBestOrderId({
    _type: orderType,
    _market: marketID,
    _outcome: outcome
  }, (bestOrderId) => {
    if (!bestOrderId || !parseInt(bestOrderId, 16) || bestOrderId.error) {
      return callback(`best order ID not found for market ${marketID}: ${JSON.stringify(bestOrderId)}`);
    }
    dispatch(updateIsFirstOrderBookChunkLoaded(marketID, outcome, orderTypeLabel, false));
    augur.trading.orderBook.getOrderBookChunked({
      _type: orderType,
      _market: marketID,
      _outcome: outcome,
      _startingOrderId: bestOrderId,
      _numOrdersToLoad: null,
      minPrice: market.minPrice,
      maxPrice: market.maxPrice
    }, orderBookChunk => dispatch(insertOrderBookChunkToOrderBook(marketID, outcome, orderTypeLabel, orderBookChunk)), (orderBook) => {
      if (!orderBook || orderBook.error) {
        return callback(`outcome order book not loaded for market ${marketID}: ${JSON.stringify(orderBook)}`);
      }
      callback(null);
    });
  });
};

export default loadOneOutcomeBidsOrAsks;
