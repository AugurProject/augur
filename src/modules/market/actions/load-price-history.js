import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateMarketPriceHistory } from 'modules/market/actions/update-market-price-history';
import logError from 'utils/log-error';

export const loadPriceHistory = (options, callback = logError) => (dispatch, getState) => {
  const { branch, env, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  const query = { ...options, branch: branch.id, reporter: loginAccount.address };
  loadDataFromAugurNode(env.augurNodeURL, 'getPriceHistory', query, (err, priceHistory) => {
    if (err) return callback(err);
    if (priceHistory == null) return callback(`no price history data received from ${env.augurNodeURL}`);
    dispatch(updateMarketPriceHistory(options.market, priceHistory));
    callback(null, priceHistory);
  });
};
