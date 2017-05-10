import async from 'async';
import { augur, constants } from 'services/augurjs';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';

export function loadReportingHistory(options, cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadReportingHistory:', e));
    const { branch, loginAccount } = getState();
    const params = {
      ...options,
      sender: loginAccount.address,
      branch: branch.id
    };
    if (!params.fromBlock && loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber;
    }
    async.eachLimit([
      'collectedFees',
      'penalizationCaughtUp',
      'penalize',
      'submittedReport',
      'submittedReportHash',
      'slashedRep'
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.getLogsChunked(label, params, null, (logs) => {
        if (logs && logs.length) dispatch(convertLogsToTransactions(label, logs));
      }, nextLabel);
    }, (err) => {
      if (err) return callback(err);
      augur.getLogsChunked('slashedRep', { ...params, sender: null, reporter: loginAccount.address }, null, (logs) => {
        if (logs && logs.length) dispatch(convertLogsToTransactions('slashedRep', logs));
      }, callback);
    });
  };
}
