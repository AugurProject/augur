import async from 'async';
import { augur, constants } from 'services/augurjs';
import { updateAccountBidsAsksData, updateAccountCancelsData } from 'modules/my-positions/actions/update-account-trades-data';
import logError from 'utils/log-error';

export const loadBidsAsksHistory = (marketID, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState();
  const filter = { market: marketID, sender: loginAccount.address };
  if (loginAccount.registerBlockNumber) {
    filter.fromBlock = loginAccount.registerBlockNumber;
  }
  async.parallelLimit([
    next => augur.logs.getLogsChunked({
      label: 'log_add_tx',
      filter,
      aux: { index: ['market', 'outcome'] }
    }, (logs) => {
      dispatch(updateAccountBidsAsksData(logs, marketID));
    }, next),
    next => augur.logs.getLogsChunked({
      label: 'log_cancel',
      filter,
      aux: { index: ['market', 'outcome'] }
    }, (logs) => {
      dispatch(updateAccountCancelsData(logs, marketID));
    }, next)
  ], constants.PARALLEL_LIMIT, callback);
};
