import { augur } from 'services/augurjs';
import { clearMarketOrderBook, updateMarketOrderBook } from 'modules/bids-asks/actions/update-market-order-book';
import logError from 'utils/log-error';

const BID = 1;
const ASK = 2;

export const loadBidsAsks = (marketID, callback = logError) => (dispatch, getState) => {
  const market = getState().marketsData[marketID];
  const outcomes = new Array(market.numOutcomes);
  outcomes.forEach((_, i) => outcomes[i] = i + 1);
  async.forEachOfSeries(outcomes, (outcome, nextOutcome) => {
    async.eachSeries([BID, ASK], (orderType, nextOrderType) => {
      let firstChunkLoaded;
      augur.api.Orders.getBestOrderId({
        _type: orderType,
        _market: marketID,
        _outcome: outcome
      }, (bestOrderId) => {
        augur.trading.orderBook.getOrderBookChunked({
          _type: orderType,
          _market: marketID,
          _startingOrderId:
          _numOrdersToLoad: null,
          minPrice: market.minPrice,
          maxPrice: market.maxPrice
        }, (orderBookChunk) => {
          console.log('order book chunk:', marketID, orderBookChunk);
          if (!firstChunkLoaded) {
            firstChunkLoaded = true;
            console.log('first chunk, clearing order book...');
            dispatch(clearMarketOrderBook(marketID));
          }
          dispatch(updateMarketOrderBook(marketID, orderBookChunk));
        }, (orderBook) => {
          console.log('order book loaded for outcome', outcome, 'type', orderType);
          if (!orderBook || orderBook.error) return nextOrderType(orderBook);
          nextOrderType();
        });
      });
    }, (err) => {
      console.log('bid and ask complete for this outcome', outcome, err);
      nextOutcome(err);
    });
  }, (err) => {
    console.log('got all outcomes for market', marketID, err);
    callback(err);
  });
};
