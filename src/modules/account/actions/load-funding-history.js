import async from 'async';
import { augur, constants } from '../../../services/augurjs';
import { convertLogsToTransactions } from '../../../modules/transactions/actions/convert-logs-to-transactions';

export function loadFundingHistory(cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadFundingHistory:', e));
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
      const p = label === 'fundedAccount' ? { ...params, fromBlock: null } : params;
      augur.getLogsChunked(label, p, null, (logs) => {
        if (logs && logs.length) dispatch(convertLogsToTransactions(label, logs));
      }, nextLabel);
    }, callback);
  };
}

export function loadTransferHistory(cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadTransferHistory:', e));
    const { loginAccount } = getState();
    const params = {};
    if (loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber;
    }
    async.eachLimit([
      'Transfer',
      'sentCash'
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.getLogsChunked(label, { ...params, _from: loginAccount.address }, null, (logs) => {
        if (logs && logs.length) dispatch(convertLogsToTransactions(label, logs));
      }, (err) => {
        augur.getLogsChunked(label, { ...params, _to: loginAccount.address }, null, (logs) => {
          if (logs && logs.length) dispatch(convertLogsToTransactions(label, logs));
        }, nextLabel);
      });
    }, callback);
  };
}

