import { augur } from '../../../services/augurjs';
import { updateMarketPriceHistory } from '../../market/actions/update-market-price-history';
import { updateMarketTradesData } from '../../portfolio/actions/update-market-trades-data';

export const UPDATE_MARKET_ORDER_BOOK = 'UPDATE_MARKET_ORDER_BOOK';
export const REPLACE_MARKET_ORDER_BOOK = 'REPLACE_MARKET_ORDER_BOOK';
export const CLEAR_MARKET_ORDER_BOOK = 'CLEAR_MARKET_ORDER_BOOK';

export const updateMarketOrderBook = (marketID, marketOrderBook) => ({ type: UPDATE_MARKET_ORDER_BOOK, marketID, marketOrderBook });
export const replaceMarketOrderBook = (marketID, marketOrderBook) => ({ type: REPLACE_MARKET_ORDER_BOOK, marketID, marketOrderBook });
export const clearMarketOrderBook = marketID => ({ type: CLEAR_MARKET_ORDER_BOOK, marketID });

export const addOrder = log => (dispatch, getState) => {
  const orderBook = { ...getState().orderBooks[log.market] };
  const market = getState().marketsData[log.market];
  if (market && orderBook) {
    const order = augur.convertAddTxLogToOrder(log, market.type, market.minValue);
    dispatch(replaceMarketOrderBook(log.market, augur.addOrder(order, orderBook)));
  }
};

export const removeOrder = log => (dispatch, getState) => {
  const { orderBooks } = getState();
  const orderBook = orderBooks[log.market];
  if (orderBook && getState().marketsData[log.market]) {
    dispatch(replaceMarketOrderBook(log.market, augur.removeOrder(log.tradeid, log.type, orderBook)));
  }
};

export const fillOrder = log => (dispatch, getState) => {
  const { marketsData, orderBooks, priceHistory } = getState();
  const orderBook = { ...orderBooks[log.market] };
  const market = marketsData[log.market];
  if (market) {
    const matchedType = log.type === 'buy' ? 'sell' : 'buy';
    const updatedOrderBook = augur.fillOrder(log.tradeid, log.amount, matchedType, orderBook);
    if (augur.options.debug.trading) {
      console.debug('updatedOrderBook:', updatedOrderBook);
    }
    dispatch(replaceMarketOrderBook(log.market, updatedOrderBook));
    const marketPriceHistory = priceHistory[log.market] ? { ...priceHistory[log.market] } : {};
    if (!marketPriceHistory[log.outcome]) marketPriceHistory[log.outcome] = [];
    marketPriceHistory[log.outcome].push(log);
    dispatch(updateMarketTradesData({ [log.market]: marketPriceHistory }));
    dispatch(updateMarketPriceHistory(log.market, marketPriceHistory));
  }
};
