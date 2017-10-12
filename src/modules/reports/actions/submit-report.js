import { augur } from 'services/augurjs'
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { updateReport } from 'modules/reports/actions/update-reports'
import { nextReportPage } from 'modules/reports/actions/next-report-page'
import noop from 'utils/noop'
import logError from 'utils/log-error'

export const submitReport = (market, reportedOutcomeID, amountToStake, isIndeterminate, history, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (!loginAccount.address || !market || !reportedOutcomeID || !amountToStake) {
    return console.error('submitReport failed:', loginAccount.address, market, reportedOutcomeID, amountToStake)
  }
  const universeID = universe.id
  console.log(`submit report ${reportedOutcomeID} on market ${market.id} period ${universe.currentReportingWindowAddress}...`)
  const payoutNumerators = reportedOutcomeID // TODO convert reported outcome ID to payout numerators or just pass in payoutNumerators
  const report = {
    marketID: market.id,
    period: universe.currentReportingWindowAddress, // TODO replace .period with .reportingWindow
    reportedOutcomeID,
    isCategorical: market.type === CATEGORICAL,
    isScalar: market.type === SCALAR,
    isIndeterminate,
    isSubmitted: false
  }
  dispatch(updateReport(universeID, market.id, { ...report }))
  augur.reporting.submitReport({
    _signer: getState().loginAccount.privateKey,
    market: market.id,
    _payoutNumerators: payoutNumerators,
    _amountToStake: amountToStake,
    onSent: noop,
    onSuccess: () => {
      const { reports } = getState()
      dispatch(updateReport(universeID, market.id, { ...(reports[universeID] || {})[market.id], isSubmitted: true }))
      callback(null)
    },
    onFailed: (err) => {
      const { reports } = getState()
      dispatch(updateReport(universeID, market.id, { ...(reports[universeID] || {})[market.id], isSubmitted: false }))
      callback(err)
    }
  })
  dispatch(nextReportPage(history))
}
