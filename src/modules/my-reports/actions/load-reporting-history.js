import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addReportingTransactions } from 'modules/transactions/actions/add-transactions'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

export function loadReportingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.reporting.getReportingHistory({ ...options, reporter: loginAccount.address, universe: universe.id }, (err, reportingHistory) => {
      if (err) return callback(err)
      if (err) return callback(err)
      if (reportingHistory == null || Object.keys(reportingHistory).length === 0) return callback(null)
      const marketIds = Object.keys(reportingHistory[universe.id])
      // TODO: not sure we want to start cascading calls, need discussion
      dispatch(loadMarketsInfo(marketIds.slice(), () => {
        dispatch(addReportingTransactions(reportingHistory))
        // TODO update user's reporting history
        callback(null, reportingHistory)
      }))
    })
  }
}
