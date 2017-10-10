import { augur } from 'services/augurjs';
import { updateMarketPriceHistory } from 'modules/market/actions/update-market-price-history';
import logError from 'utils/log-error';

export const loadPriceHistory = (options, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  augur.markets.getMarketPriceHistory({ ...options, marketID: options.market }, (err, priceHistory) => {
    if (err) return callback(err);
    if (priceHistory == null) return callback(null);
    dispatch(updateMarketPriceHistory(options.market, priceHistory));
    callback(null, priceHistory);
  });
};
