import async from 'async';
import { augur, constants } from 'services/augurjs';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';

export function loadCreateMarketHistory(marketID, fromBlock, cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadCreateMarketHistory:', e));
    const { branch, loginAccount } = getState();
    const params = { sender: loginAccount.address, branch: branch.id };
    if (fromBlock || loginAccount.registerBlockNumber) {
      params.fromBlock = fromBlock || loginAccount.registerBlockNumber;
    }
    async.eachLimit([
      'marketCreated',
      'tradingFeeUpdated'
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.getLogsChunked(label, params, null, (logs) => {
        if (logs && logs.length) dispatch(convertLogsToTransactions(label, logs));
      }, nextLabel);
    }, callback);
  };
}
