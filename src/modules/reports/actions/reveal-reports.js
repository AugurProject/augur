import async from 'async'
import { augur } from 'services/augurjs'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { updateAssets } from 'modules/auth/actions/update-assets'
import { updateReports } from 'modules/reports/actions/update-reports'

const revealReportLock = {}

export function revealReports(cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('revealReports:', e))
    const { branch, loginAccount, reports } = getState()
    // Make sure that:
    //  - branch is in the second half of its reporting period
    //  - user is logged in and has Rep
    //  - that this user has committed reports to reveal
    if (branch.isReportRevealPhase && loginAccount.rep && reports) {
      const branchReports = reports[branch.id]
      if (!branchReports) return callback(null)
      const revealableReports = Object.keys(branchReports)
        .filter(eventId => branchReports[eventId].reportHash &&
        branchReports[eventId].reportHash.length && !branchReports[eventId].isRevealed && branchReports[eventId].period === branch.reportPeriod)
        .map((eventId) => {
          const obj = { ...branchReports[eventId], eventId }
          return obj
        })
      console.log('revealableReports:', revealableReports)
      if (revealableReports && revealableReports.length && loginAccount.address) {
        async.eachSeries(revealableReports, (report, nextReport) => {
          const { eventId } = report
          console.log('revealReportLock:', eventId, revealReportLock[eventId])
          if (revealReportLock[eventId]) return nextReport()
          revealReportLock[eventId] = true
          let type
          if (report.isScalar) {
            type = SCALAR
          } else if (report.isCategorical) {
            type = CATEGORICAL
          } else {
            type = BINARY
          }
          augur.reporting.submitReport({
            event: eventId,
            report: report.reportedOutcomeId,
            salt: report.salt,
            ethics: Number(!report.isUnethical),
            minValue: report.minValue,
            maxValue: report.maxValue,
            type,
            isIndeterminate: report.isIndeterminate,
            onSent: r => console.log('submitReport sent:', r),
            onSuccess: (r) => {
              console.log('submitReport success:', r)
              dispatch(updateAssets())
              revealReportLock[eventId] = false
              dispatch(updateReports({
                [branch.id]: {
                  [eventId]: { ...report, isRevealed: true },
                },
              }))
              nextReport()
            },
            onFailed: e => nextReport(e),
          })
        }, e => callback(e))
      }
    }
  }
}
