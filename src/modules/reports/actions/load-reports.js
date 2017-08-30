import { augur } from 'services/augurjs'
import { updateHasLoadedReports } from 'modules/reports/actions/update-has-loaded-reports'
import { clearReports, updateReports } from 'modules/reports/actions/update-reports'
import logError from 'utils/log-error'

export const loadReports = (options, callback = logError) => (dispatch, getState) => {
  const { branch, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  if (!loginAccount.rep || loginAccount.rep === '0') return callback(null)
  if (!branch.id) return callback(null)
  const query = { ...options, branch: branch.id, reporter: loginAccount.address }
  augur.reporting.getReportingHistory(query, (err, reports) => {
    if (err) return callback(err)
    if (reports == null) {
      dispatch(updateHasLoadedReports(false))
      return callback(`no reports data received`)
    }
    dispatch(clearReports())
    dispatch(updateReports(reports))
    dispatch(updateHasLoadedReports(true))
    callback(null, reports)
  })
}
