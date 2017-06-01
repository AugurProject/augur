import async from 'async';
import { augur, constants } from 'services/augurjs';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
<<<<<<< HEAD
import logError from 'utils/log-error';

export function loadReportingHistory(callback = logError) {
=======

export function loadReportingHistory(options, cb) {
>>>>>>> master
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState();
<<<<<<< HEAD
    const filter = { sender: loginAccount.address, branch: branch.id };
    if (loginAccount.registerBlockNumber) {
      filter.fromBlock = loginAccount.registerBlockNumber;
=======
    const params = {
      ...options,
      sender: loginAccount.address,
      branch: branch.id
    };
    if (!params.fromBlock && loginAccount.registerBlockNumber) {
      params.fromBlock = loginAccount.registerBlockNumber;
>>>>>>> master
    }
    async.eachLimit([
      'collectedFees',
      'penalizationCaughtUp',
      'penalize',
      'submittedReport',
      'submittedReportHash',
      'slashedRep'
    ], constants.PARALLEL_LIMIT, (label, nextLabel) => {
      augur.logs.getLogsChunked({ label, filter, aux: null }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions(label, logs));
      }, nextLabel);
    }, (err) => {
      if (err) return callback(err);
      augur.logs.getLogsChunked({
        label: 'slashedRep',
        filter: { ...filter, sender: null, reporter: loginAccount.address },
        aux: null
      }, (logs) => {
        if (Array.isArray(logs) && logs.length) dispatch(convertLogsToTransactions('slashedRep', logs));
      }, callback);
    });
  };
}
