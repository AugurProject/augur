import secureRandom from 'secure-random'
import { augur } from 'services/augurjs'
import { bytesToHex } from 'utils/bytes-to-hex'
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { updateReport } from 'modules/reports/actions/update-reports'
import { nextReportPage } from 'modules/reports/actions/next-report-page'
import { encryptReport } from 'modules/reports/actions/report-encryption'

export const UPDATE_REPORT_COMMIT_LOCK = 'UPDATE_REPORT_COMMIT_LOCK'

export const updateReportCommitLock = (eventId, isLocked) => ({ type: UPDATE_REPORT_COMMIT_LOCK, eventId, isLocked })

export const commitReport = (market, reportedOutcomeId, isUnethical, isIndeterminate, history) => (dispatch, getState) => {
  const { branch, loginAccount, reportCommitLock } = getState()
  if (!loginAccount.address || !market || !reportedOutcomeId) {
    return console.error('commitReport failed:', loginAccount.address, market, reportedOutcomeId)
  }
  const { eventId } = market
  if (reportCommitLock[eventId]) {
    return console.warn('reportCommitLock set:', eventId, reportCommitLock)
  }
  dispatch(updateReportCommitLock(eventId, true))
  const branchId = branch.id
  console.log(`committing to report ${reportedOutcomeId} on market ${market.id} event ${eventId} period ${branch.reportPeriod}...`)
  const salt = bytesToHex(secureRandom(32))
  const fixedReport = augur.reporting.format.fixReport(reportedOutcomeId, market.minValue, market.maxValue, market.type, isIndeterminate)
  const report = {
    eventId,
    marketId: market.id,
    period: branch.reportPeriod,
    reportedOutcomeId,
    isCategorical: market.type === CATEGORICAL,
    isScalar: market.type === SCALAR,
    isUnethical,
    isIndeterminate,
    salt,
    reportHash: augur.reporting.crypto.makeHash(salt, fixedReport, eventId, loginAccount.address),
    isCommitted: false,
    isRevealed: false,
  }
  const encrypted = encryptReport(fixedReport, salt)
  dispatch(updateReport(branchId, eventId, { ...report }))
  augur.reporting.submitReportHash({
    event: eventId,
    reportHash: report.reportHash,
    encryptedReport: encrypted.report,
    encryptedSalt: encrypted.salt,
    ethics: Number(!isUnethical),
    branch: branchId,
    period: branch.reportPeriod,
    periodLength: branch.periodLength,
    onSent: () => {},
    onSuccess: (r) => {
      dispatch(updateReportCommitLock(eventId, false))
      dispatch(updateReport(branchId, eventId, {
        ...(getState().reports[branchId] || {})[eventId],
        isCommitted: true,
      }))
    },
    onFailed: (e) => {
      console.error('submitReportHash failed:', e)
      dispatch(updateReportCommitLock(eventId, false))
      dispatch(updateReport(branchId, eventId, {
        ...(getState().reports[branchId] || {})[eventId],
        isCommitted: false,
      }))
    },
  })
  dispatch(nextReportPage(history))
}
