import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { parallel } from 'async';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { APPROVAL, TRANSFER, DEPOSIT_ETHER, WITHDRAW_ETHER } from 'modules/transactions/constants/types';
import logError from 'utils/log-error';

export function loadFundingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { env, loginAccount } = getState();
    if (!loginAccount.address) return callback(null);
    const query = { ...options, account: loginAccount.address };
    // TODO should these be combined into one or two augur-node lookups, instead of four separate lookups?
    parallel([
      next => loadDataFromAugurNode(env.augurNodeURL, 'getTransferHistory', query, (err, transferHistory) => {
        if (err) return next(err);
        if (transferHistory == null) return next(`no transfer history data received from ${env.augurNodeURL}`);
        if (Array.isArray(transferHistory) && transferHistory.length) {
          dispatch(convertLogsToTransactions(TRANSFER, transferHistory));
        }
        next(null, transferHistory);
      }),
      next => loadDataFromAugurNode(env.augurNodeURL, 'getApprovalHistory', query, (err, approvalHistory) => {
        if (err) return next(err);
        if (approvalHistory == null) return next(`no approval history data received from ${env.augurNodeURL}`);
        if (Array.isArray(approvalHistory) && approvalHistory.length) {
          dispatch(convertLogsToTransactions(APPROVAL, approvalHistory));
        }
        next(null, approvalHistory);
      }),
      next => loadDataFromAugurNode(env.augurNodeURL, 'getDepositEtherHistory', query, (err, depositEtherHistory) => {
        if (err) return next(err);
        if (depositEtherHistory == null) return next(`no deposit ether history data received from ${env.augurNodeURL}`);
        if (Array.isArray(depositEtherHistory) && depositEtherHistory.length) {
          dispatch(convertLogsToTransactions(DEPOSIT_ETHER, depositEtherHistory));
        }
        next(null, depositEtherHistory);
      }),
      next => loadDataFromAugurNode(env.augurNodeURL, 'getWithdrawEtherHistory', query, (err, withdrawEtherHistory) => {
        if (err) return next(err);
        if (withdrawEtherHistory == null) return next(`no deposit ether history data received from ${env.augurNodeURL}`);
        if (Array.isArray(withdrawEtherHistory) && withdrawEtherHistory.length) {
          dispatch(convertLogsToTransactions(WITHDRAW_ETHER, withdrawEtherHistory));
        }
        next(null, withdrawEtherHistory);
      })
    ], callback);
  };
}
