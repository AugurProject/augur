import async from 'async';
import { augur, constants } from 'services/augurjs';
import { updateAccountBidsAsksData, updateAccountCancelsData } from 'modules/my-positions/actions/update-account-trades-data';
import { MAKE_ORDER, CANCEL_ORDER } from 'modules/transactions/constants/types';
import logError from 'utils/log-error';

export const loadBidsAsksHistory = (options, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState();
  const filter = {
    ...options,
    sender: loginAccount.address
  };
  if (!filter.fromBlock && loginAccount.registerBlockNumber) {
    filter.fromBlock = loginAccount.registerBlockNumber;
  }
  async.parallelLimit([
    next => augur.logs.getLogsChunked({
      label: MAKE_ORDER,
      filter,
      aux: { index: ['market', 'outcome'] }
    }, (logs) => {
      dispatch(updateAccountBidsAsksData(logs, filter.market));
    }, next),
    next => augur.logs.getLogsChunked({
      label: CANCEL_ORDER,
      filter,
      aux: { index: ['market', 'outcome'] }
    }, (logs) => {
      dispatch(updateAccountCancelsData(logs, filter.market));
    }, next)
  ], constants.PARALLEL_LIMIT, callback);
};
