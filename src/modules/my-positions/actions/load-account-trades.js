import async from 'async';
import { augur } from 'services/augurjs';
import { updateAccountTradesData, updateCompleteSetsBought, updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { clearAccountTrades } from 'modules/my-positions/actions/clear-account-trades';
import { sellCompleteSets } from 'modules/my-positions/actions/sell-complete-sets';
import logError from 'utils/log-error';

export function loadAccountTrades(marketID, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    const account = loginAccount.address;
    if (!account) return callback();
    const filter = { market: marketID };
    if (loginAccount.registerBlockNumber) {
      filter.fromBlock = loginAccount.registerBlockNumber;
    }
    if (!marketID) dispatch(clearAccountTrades());
    async.parallel([
      next => augur.trading.positions.getAdjustedPositions({ account, filter }, (err, positions) => {
        if (err) return next(err);
        dispatch(updateAccountPositionsData(positions, marketID));
        next(null);
      }),
      next => augur.logs.getAccountTrades({ account, filter }, (err, trades) => {
        if (err) return next(err);
        dispatch(updateAccountTradesData(trades, marketID));
        next(null);
      }),
      next => augur.logs.getLogsChunked({
        label: 'payout',
        filter: { fromBlock: filter.fromBlock, sender: account },
        aux: null
      }, (payouts) => {
        if (payouts && payouts.length) dispatch(convertLogsToTransactions('payout', payouts));
      }, next),
      next => augur.logs.getBuyCompleteSetsLogs({ account, filter }, (err, completeSets) => {
        if (err) return next(err);
        dispatch(updateCompleteSetsBought(augur.logs.parseCompleteSetsLogs(completeSets), marketID));
        next(null);
      })
    ], (err) => {
      if (err) return callback(err);
      dispatch(sellCompleteSets(marketID, callback));
    });
  };
}
