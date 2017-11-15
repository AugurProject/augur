import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addReportingTransactions } from 'modules/transactions/actions/add-transactions'

export function loadReportingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.reporting.getReportingHistory({ ...options, reporter: loginAccount.address, universe: universe.id }, (err, reportingHistory) => {
      if (err) return callback(err)
      if (err) return callback(err)
      if (reportingHistory == null) return callback(null)
      dispatch(addReportingTransactions(reportingHistory))
      // TODO update user's reporting history
      callback(null, reportingHistory)
    })
  }
}
