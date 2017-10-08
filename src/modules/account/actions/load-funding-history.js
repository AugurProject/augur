import { augur } from 'services/augurjs';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { TRANSFER } from 'modules/transactions/constants/types';
import logError from 'utils/log-error';

export function loadFundingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    if (!loginAccount.address) return callback(null);
    const query = { ...options, account: loginAccount.address };
    augur.account.getAccountTransferHistory(query, (err, transferHistory) => {
      if (err) return callback(err);
      if (transferHistory == null) return callback(`no transfer history data received`);
      if (Array.isArray(transferHistory) && transferHistory.length) {
        dispatch(convertLogsToTransactions(TRANSFER, transferHistory));
      }
      callback(null, transferHistory);
    });
  };
}
