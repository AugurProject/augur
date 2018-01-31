import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addTransferTransactions } from 'modules/transactions/actions/add-transactions'

export function loadFundingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.accounts.getAccountTransferHistory({ ...options, account: loginAccount.address }, (err, transferHistory) => {
      if (err) return callback(err)
      if (transferHistory == null || transferHistory.length === 0) return callback(null)
      dispatch(addTransferTransactions(transferHistory))
      callback(null, transferHistory)
    })
  }
}
