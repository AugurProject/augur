import async from 'async';
import { augur, constants } from 'services/augurjs';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import logError from 'utils/log-error';

export function loadFundingHistory(callback = logError) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState();
    const params = { sender: loginAccount.address, branch: branch.id };
    if (loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber;
    }
    async.eachLimit([
      'fundedAccount',
      'registration',
      'deposit',
      'withdraw',
      'Approval'
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.logs.getLogsChunked({
        label,
        filter: label === 'fundedAccount' ? { ...params, fromBlock: null } : params,
        aux: null
      }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs));
      }, nextLabel);
    }, callback);
  };
}

export function loadTransferHistory(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    const params = {};
    if (loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber;
    }
    async.eachLimit([
      'Transfer',
      'sentCash'
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.logs.getLogsChunked({
        label,
        filter: { ...params, _from: loginAccount.address },
        aux: null
      }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs));
      }, (err) => {
        augur.logs.getLogsChunked({
          label,
          filter: { ...params, _to: loginAccount.address },
          aux: null
        }, (logs) => {
          if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs));
        }, nextLabel);
      });
    }, callback);
  };
}
