import { parallel } from 'async';
import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateAccountTradesData } from 'modules/my-positions/actions/update-account-trades-data';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { clearAccountTrades } from 'modules/my-positions/actions/clear-account-trades';
import { PAYOUT } from 'modules/transactions/constants/types';
import logError from 'utils/log-error';

export function loadAccountTrades(options, callback = logError) {
  return (dispatch, getState) => {
    const { branch, env, loginAccount } = getState();
    if (!loginAccount.address || !options) return callback(null);
    if (!options.market) dispatch(clearAccountTrades());
    const query = { ...options, account: loginAccount.address, branch: branch.id };
    parallel([
      next => loadDataFromAugurNode(env.augurNodeURL, 'getTradeHistory', query, (err, tradeHistory) => {
        if (err) return next(err);
        dispatch(updateAccountTradesData(tradeHistory, options.market));
        next(null);
      }),
      next => loadDataFromAugurNode(env.augurNodeURL, 'getPayoutHistory', query, (err, payoutHistory) => {
        if (err) return next(err);
        if (Array.isArray(payoutHistory) && payoutHistory.length) {
          dispatch(convertLogsToTransactions(PAYOUT, payoutHistory));
        }
        next(null);
      })
    ], callback);
  };
}
