import { augur } from 'services/augurjs'
import { decryptReport } from 'modules/reports/actions/report-encryption'
import { updateReport } from 'modules/reports/actions/update-reports'

export function loadReport(branchId, period, eventId, marketId, callback) {
  return (dispatch, getState) => {
    const { loginAccount, marketsData } = getState()
    const market = marketsData[marketId]
    if (!market) {
      console.error('loadReport failed:', branchId, marketId, market)
      return callback(null)
    }
    augur.reporting.getReport(branchId, period, eventId, loginAccount.address, market.minValue, market.maxValue, market.type, (report) => {
      console.log('got report:', report)
      if (!report || !report.report || report.error) {
        return callback(report || 'getReport failed')
      }
      const reportedOutcomeId = report.report
      if (reportedOutcomeId && reportedOutcomeId !== '0' && !reportedOutcomeId.error) {
        dispatch(updateReport(branchId, eventId, {
          period,
          marketId,
          reportedOutcomeId,
          isIndeterminate: report.isIndeterminate,
          reportHash: null,
          salt: null,
          isUnethical: false,
          isRevealed: true,
          isCommitted: true,
        }))
        return callback(null)
      }
      augur.api.ExpiringEvents.getReportHash({
        branch: branchId,
        expDateIndex: period,
        reporter: loginAccount.address,
        event: eventId,
      }, (reportHash) => {
        if (!reportHash || reportHash.error || !parseInt(reportHash, 16)) {
          console.log('reportHash:', reportHash)
          dispatch(updateReport(branchId, eventId, {
            period,
            marketId,
            reportedOutcomeId: null,
            salt: null,
            isUnethical: false,
            reportHash: null,
            isRevealed: false,
            isCommitted: false,
          }))
          return callback(null)
        }
        dispatch(decryptReport(branchId, period, eventId, (err, decryptedReport) => {
          if (err) return callback(err)
          console.log('decryptedReport:', decryptedReport)
          if (decryptedReport.reportedOutcomeId) {
            const { report, isIndeterminate } = augur.reporting.format.unfixReport(
              decryptedReport.reportedOutcomeId,
              market.minValue,
              market.maxValue,
              market.type,
            )
            decryptedReport.reportedOutcomeId = report
            decryptedReport.isIndeterminate = isIndeterminate
          }
          dispatch(updateReport(branchId, eventId, {
            period,
            marketId,
            ...decryptedReport,
            reportHash,
            isUnethical: false,
            isRevealed: false,
            isCommitted: true,
          }))
          callback(null)
        }))
      })
    })
  }
}
