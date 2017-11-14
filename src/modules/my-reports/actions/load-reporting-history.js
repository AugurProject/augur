import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export function loadReportingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.account.getReportingHistory({ ...options, reporter: loginAccount.address, universe: universe.id }, (err, reportingHistory) => {
      if (err) return callback(err)
      if (err) return callback(err)
      if (reportingHistory == null) return callback(null)
      // TODO update user's open orders
      callback(null, reportingHistory)
    })
  }
}
