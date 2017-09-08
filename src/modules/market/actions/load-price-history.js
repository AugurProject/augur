import { augur } from 'services/augurjs';
import { updateMarketPriceHistory } from 'modules/market/actions/update-market-price-history';
import logError from 'utils/log-error';

export const loadPriceHistory = (marketID, callback = logError) => (dispatch, getState) => {
  const { marketsData } = getState();
  augur.logs.getMarketPriceHistory({
    market: marketID,
    filter: { fromBlock: marketsData[marketID].creationBlock }
  }, (err, priceHistory) => {
    if (err) return callback(err);
    dispatch(updateMarketPriceHistory(marketID, priceHistory));
    callback();
  });
};
