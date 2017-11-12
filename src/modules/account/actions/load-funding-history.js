import { augur } from 'services/augurjs'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { TRANSFER } from 'modules/transactions/constants/types'
import logError from 'utils/log-error'

export function loadFundingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.accounts.getAccountTransferHistory({ ...options, account: loginAccount.address }, (err, transferHistory) => {
      if (err) return callback(err)
      if (transferHistory == null) return callback(null)
      if (Array.isArray(transferHistory) && transferHistory.length) {
        dispatch(convertLogsToTransactions(TRANSFER, transferHistory))
      }
      callback(null, transferHistory)
    })
  }
}
