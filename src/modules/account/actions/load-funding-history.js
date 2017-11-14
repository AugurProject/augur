import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export function loadFundingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.accounts.getAccountTransferHistory({ ...options, account: loginAccount.address }, (err, transferHistory) => {
      if (err) return callback(err)
      if (transferHistory == null) return callback(null)
      callback(null, transferHistory)
    })
  }
}
