import async from 'async';
import { augur } from 'services/augurjs';
import { updateAccountTradesData, updateCompleteSetsBought, updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { clearAccountTrades } from 'modules/my-positions/actions/clear-account-trades';
import { sellCompleteSets } from 'modules/my-positions/actions/sell-complete-sets';

export function loadAccountTrades(options, cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadAccountTrades:', e));
    const { loginAccount } = getState();
    const account = loginAccount.address;
    if (!account) return callback();
    const params = {
      ...(options || {})
    };
    if (!params.fromBlock && loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber;
    }
    if (!params.market) dispatch(clearAccountTrades());
    async.parallel([
      next => augur.getAccountTrades(account, params, (err, trades) => {
        if (err) return next(err);
        dispatch(updateAccountTradesData(trades, params.market));
        next(null);
      }),
      next => augur.getLogsChunked('payout', { fromBlock: params.fromBlock, sender: account }, null, (payouts) => {
        if (payouts && payouts.length) dispatch(convertLogsToTransactions('payout', payouts));
      }, next),
      next => augur.getBuyCompleteSetsLogs(account, params, (err, completeSets) => {
        if (err) return next(err);
        dispatch(updateCompleteSetsBought(augur.parseCompleteSetsLogs(completeSets), params.market));
        next(null);
      })
    ], (err) => {
      if (err) return callback(err);
      dispatch(sellCompleteSets(params.market, cb));
    });
  };
}
