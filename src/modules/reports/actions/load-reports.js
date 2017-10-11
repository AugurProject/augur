import { augur } from 'services/augurjs'
import { updateHasLoadedReports } from 'modules/reports/actions/update-has-loaded-reports'
import { clearReports, updateReports } from 'modules/reports/actions/update-reports'
import logError from 'utils/log-error'

export const loadReports = (options, callback = logError) => (dispatch, getState) => {
  const { branch, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  if (!loginAccount.rep || loginAccount.rep === '0') return callback(null)
  if (!branch.id) return callback(null)
  augur.reporting.getReportingHistory({ ...options, branch: branch.id, reporter: loginAccount.address }, (err, reportingHistory) => {
    if (err) return callback(err)
    if (reportingHistory == null) {
      dispatch(updateHasLoadedReports(false))
      return callback(null)
    }
    dispatch(clearReports())
    // TODO verify that reportingHistory is the correct shape for updateReports
    dispatch(updateReports(reportingHistory))
    dispatch(updateHasLoadedReports(true))
    callback(null, reportingHistory)
  })
}
