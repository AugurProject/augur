import async from 'async';
import { augur, constants } from '../../../services/augurjs';
import { updateAccountBidsAsksData, updateAccountCancelsData } from '../../../modules/my-positions/actions/update-account-trades-data';

export function loadBidsAsksHistory(marketID, cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadBidsAsksHistory:', e));
    const { loginAccount } = getState();
    const params = { market: marketID, sender: loginAccount.address };
    if (loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber;
    }
    async.parallelLimit([
      next => augur.getLogsChunked('log_add_tx', params, { index: ['market', 'outcome'] }, (logs) => {
        dispatch(updateAccountBidsAsksData(logs, marketID));
      }, next),
      next => augur.getLogsChunked('log_cancel', params, { index: ['market', 'outcome'] }, (logs) => {
        dispatch(updateAccountCancelsData(logs, marketID));
      }, next)
    ], constants.PARALLEL_LIMIT, callback);
  };
}
