import { augur } from 'services/augurjs';
import insertOrderBookChunkToOrderBook from 'modules/bids-asks/actions/insert-order-book-chunk-to-order-book';
import logError from 'utils/log-error';

const loadOneOutcomeBidsOrAsks = (marketID, outcome, orderType, callback = logError) => (dispatch, getState) => {
  if (marketID == null || outcome == null || orderType == null) {
    return callback(`must specify market ID, outcome, and order type: ${marketID} ${outcome} ${orderType}`);
  }
  const market = getState().marketsData[marketID];
  if (!market) {
    return callback(`market ${marketID} data not found`);
  }
  if (market.minPrice == null || market.maxPrice == null) {
    return callback(`minPrice and maxPrice not found for market ${marketID}: ${market.minPrice} ${market.maxPrice}`);
  }
  augur.api.Orders.getBestOrderId({
    _type: orderType,
    _market: marketID,
    _outcome: outcome
  }, (bestOrderId) => {
    if (!bestOrderId || !parseInt(bestOrderId, 16) || bestOrderId.error) {
      return callback(`best order ID not found for market ${marketID}: ${JSON.stringify(bestOrderId)}`);
    }
    augur.trading.orderBook.getOrderBookChunked({
      _type: orderType,
      _market: marketID,
      _outcome: outcome,
      _startingOrderId: bestOrderId,
      _numOrdersToLoad: null,
      minPrice: market.minPrice,
      maxPrice: market.maxPrice
    }, orderBookChunk => dispatch(insertOrderBookChunkToOrderBook(marketID, orderBookChunk)), (orderBook) => {
      if (!orderBook || orderBook.error) {
        return callback(`outcome order book not loaded for market ${marketID}: ${JSON.stringify(orderBook)}`);
      }
      callback(null);
    });
  });
};

export default loadOneOutcomeBidsOrAsks;
