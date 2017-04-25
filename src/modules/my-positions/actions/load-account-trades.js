import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAccountTradesData, updateCompleteSetsBought, updateAccountPositionsData } from '../../../modules/my-positions/actions/update-account-trades-data';
import { convertLogsToTransactions } from '../../../modules/transactions/actions/convert-logs-to-transactions';
import { clearAccountTrades } from '../../../modules/my-positions/actions/clear-account-trades';
import { sellCompleteSets } from '../../../modules/my-positions/actions/sell-complete-sets';

export function loadAccountTrades(marketID, fromBlock, cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadAccountTrades:', e));
    const { loginAccount } = getState();
    const account = loginAccount.address;
    if (!account) return callback();
    const options = { market: marketID };
    if (fromBlock || loginAccount.registerBlockNumber) {
      options.fromBlock = fromBlock || loginAccount.registerBlockNumber;
    }
    if (!marketID) dispatch(clearAccountTrades());
    async.parallel([
      next => augur.getAdjustedPositions(account, options, (err, positions) => {
        if (err) return next(err);
        dispatch(updateAccountPositionsData(positions, marketID));
        next(null);
      }),
      next => augur.getAccountTrades(account, options, (err, trades) => {
        if (err) return next(err);
        dispatch(updateAccountTradesData(trades, marketID));
        next(null);
      }),
      next => augur.getLogsChunked('payout', { fromBlock: options.fromBlock, sender: account }, null, (payouts) => {
        if (payouts && payouts.length) dispatch(convertLogsToTransactions('payout', payouts));
      }, next),
      next => augur.getBuyCompleteSetsLogs(account, options, (err, completeSets) => {
        if (err) return next(err);
        dispatch(updateCompleteSetsBought(augur.parseCompleteSetsLogs(completeSets), marketID));
        next(null);
      })
    ], (err) => {
      if (err) return callback(err);
      dispatch(sellCompleteSets(marketID, cb));
    });
  };
}
