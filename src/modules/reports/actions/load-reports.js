import { augur } from 'services/augurjs'
import { updateHasLoadedReports } from 'modules/reports/actions/update-has-loaded-reports'
import { clearReports, updateReports } from 'modules/reports/actions/update-reports'
import logError from 'utils/log-error'

export const loadReports = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  if (!loginAccount.rep || loginAccount.rep === '0') return callback(null)
  if (!universe.id) return callback(null)
  augur.reporting.getReportingHistory({ ...options, universe: universe.id, reporter: loginAccount.address }, (err, reportingHistory) => {
    // returned shape: { universe: { marketID: [{ marketID, reportingWindow, payoutNumerators, isCategorical, isScalar, isIndeterminate, isSubmitted }] } }
    // NB: can report more than once on a market, so returns an ARRAY of reports per universe per market, instead of just one
    if (err) return callback(err)
    if (reportingHistory == null) {
      dispatch(updateHasLoadedReports(false))
      return callback(null)
    }
    dispatch(clearReports())
    // TODO create function to convert between reportedOutcomeID and payoutNumerators (or just have the UI use payoutNumerators directly)
    // TODO convert reportingWindow field to period field (or have the UI use .reportingWindow)
    dispatch(updateReports(reportingHistory))
    dispatch(updateHasLoadedReports(true))
    callback(null, reportingHistory)
  })
}
