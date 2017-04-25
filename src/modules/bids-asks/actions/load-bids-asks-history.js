import async from 'async';
import { augur, constants } from '../../../services/augurjs';
import { updateAccountBidsAsksData, updateAccountCancelsData } from '../../../modules/my-positions/actions/update-account-trades-data';

export function loadBidsAsksHistory(options, cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadBidsAsksHistory:', e));
    const { loginAccount } = getState();
    const params = {
      ...options,
      sender: loginAccount.address
    };
    if (!params.fromBlock && loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber;
    }
    async.parallelLimit([
      next => augur.getLogsChunked('log_add_tx', params, { index: ['market', 'outcome'] }, (logs) => {
        dispatch(updateAccountBidsAsksData(logs, params.market));
      }, next),
      next => augur.getLogsChunked('log_cancel', params, { index: ['market', 'outcome'] }, (logs) => {
        dispatch(updateAccountCancelsData(logs, params.market));
      }, next)
    ], constants.PARALLEL_LIMIT, callback);
  };
}
