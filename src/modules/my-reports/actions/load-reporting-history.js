import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addReportingTransactions } from 'modules/transactions/actions/add-transactions'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'

export function loadReportingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.reporting.getReportingHistory({ ...options, reporter: loginAccount.address, universe: universe.id }, (err, reportingHistory) => {
      if (err) return callback(err)
      if (err) return callback(err)
      if (reportingHistory == null || Object.keys(reportingHistory).length === 0) return callback(null)
      const marketIDs = Object.keys(reportingHistory[universe.id])
      // TODO: not sure we want to start cascading calls, need discussion
      augur.markets.getMarketsInfo({ marketIDs }, (err, marketsData) => {
        if (err) return callback(err)
        const marketInfoIDs = Object.keys(marketsData)
        if (!marketInfoIDs.length) return callback(null)
        dispatch(addReportingTransactions(reportingHistory))
        dispatch(updateMarketsData(marketsData))
        // TODO update user's reporting history
        callback(null, reportingHistory)
      })
    })
  }
}
