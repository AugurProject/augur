import secureRandom from 'secure-random'
import { augur } from 'services/augurjs'
import { bytesToHex } from 'utils/bytes-to-hex'
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { updateReport } from 'modules/reports/actions/update-reports'
import { nextReportPage } from 'modules/reports/actions/next-report-page'
import { encryptReport } from 'modules/reports/actions/report-encryption'

export const UPDATE_REPORT_COMMIT_LOCK = 'UPDATE_REPORT_COMMIT_LOCK'

export const updateReportCommitLock = (eventID, isLocked) => ({ type: UPDATE_REPORT_COMMIT_LOCK, eventID, isLocked })

export const commitReport = (market, reportedOutcomeID, isUnethical, isIndeterminate, history) => (dispatch, getState) => {
  const { branch, loginAccount, reportCommitLock } = getState()
  if (!loginAccount.address || !market || !reportedOutcomeID) {
    return console.error('commitReport failed:', loginAccount.address, market, reportedOutcomeID)
  }
  const { eventID } = market
  if (reportCommitLock[eventID]) {
    return console.warn('reportCommitLock set:', eventID, reportCommitLock)
  }
  dispatch(updateReportCommitLock(eventID, true))
  const branchID = branch.id
  console.log(`committing to report ${reportedOutcomeID} on market ${market.id} event ${eventID} period ${branch.reportPeriod}...`)
  const salt = bytesToHex(secureRandom(32))
  const fixedReport = augur.reporting.format.fixReport(reportedOutcomeID, market.minValue, market.maxValue, market.type, isIndeterminate)
  const report = {
    eventID,
    marketID: market.id,
    period: branch.reportPeriod,
    reportedOutcomeID,
    isCategorical: market.type === CATEGORICAL,
    isScalar: market.type === SCALAR,
    isUnethical,
    isIndeterminate,
    salt,
    reportHash: augur.reporting.crypto.makeHash(salt, fixedReport, eventID, loginAccount.address),
    isCommitted: false,
    isRevealed: false
  }
  const encrypted = encryptReport(fixedReport, salt)
  dispatch(updateReport(branchID, eventID, { ...report }))
  augur.reporting.submitReportHash({
    event: eventID,
    reportHash: report.reportHash,
    encryptedReport: encrypted.report,
    encryptedSalt: encrypted.salt,
    ethics: Number(!isUnethical),
    branch: branchID,
    period: branch.reportPeriod,
    periodLength: branch.periodLength,
    onSent: () => {},
    onSuccess: (r) => {
      dispatch(updateReportCommitLock(eventID, false))
      dispatch(updateReport(branchID, eventID, {
        ...(getState().reports[branchID] || {})[eventID],
        isCommitted: true
      }))
    },
    onFailed: (e) => {
      console.error('submitReportHash failed:', e)
      dispatch(updateReportCommitLock(eventID, false))
      dispatch(updateReport(branchID, eventID, {
        ...(getState().reports[branchID] || {})[eventID],
        isCommitted: false
      }))
    }
  })
  dispatch(nextReportPage(history))
}
