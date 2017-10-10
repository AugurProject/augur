import { augur } from 'services/augurjs';
import { updateAccountTradesData } from 'modules/my-positions/actions/update-account-trades-data';
import { clearAccountTrades } from 'modules/my-positions/actions/clear-account-trades';
import logError from 'utils/log-error';

export function loadAccountTrades(options, callback = logError) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState();
    if (!loginAccount.address || !options) return callback(null);
    const marketID = options.market;
    if (!marketID) dispatch(clearAccountTrades());
    augur.trading.getUserTradingHistory({ ...options, account: loginAccount.address, universe: branch.id, marketID }, (err, userTradingHistory) => {
      if (err) return callback(err);
      if (userTradingHistory != null) {
        // TODO verify that userTradingHistory is the correct shape for updateAccountTradesData
        dispatch(updateAccountTradesData(userTradingHistory, options.market));
      }
      callback(null);
    });
  };
}
