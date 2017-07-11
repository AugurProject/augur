import async from 'async';
import { augur, constants } from 'services/augurjs';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { MARKET_CREATED, TRADING_FEE_UPDATED } from 'modules/transactions/constants/types';
import logError from 'utils/log-error';

export function loadCreateMarketHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState();
    const filter = {
      ...options,
      sender: loginAccount.address,
      branch: branch.id
    };
    if (!filter.fromBlock && loginAccount.registerBlockNumber) {
      filter.fromBlock = loginAccount.registerBlockNumber;
    }
    async.eachLimit([
      MARKET_CREATED,
      TRADING_FEE_UPDATED
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.logs.getLogsChunked({ label, filter, aux: null }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs));
      }, nextLabel);
    }, callback);
  };
}
