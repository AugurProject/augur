import { augur } from 'services/augurjs';
import { updateMarketPriceHistory } from 'modules/market/actions/update-market-price-history';

export const loadPriceHistory = (marketID, callback) => (dispatch, getState) => (
  augur.logs.getMarketPriceHistory({
    market: marketID,
    filter: { fromBlock: getState().marketsData[marketID].creationBlock }
  }, (err, priceHistory) => {
    if (callback) callback();
    if (err) return console.error('loadPriceHistory', err);
    dispatch(updateMarketPriceHistory(marketID, priceHistory));
  })
);
