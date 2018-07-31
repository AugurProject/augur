import { augur } from 'services/augurjs'
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { updateReport } from 'modules/reports/actions/update-reports'
import { nextReportPage } from 'modules/reports/actions/next-report-page'
import noop from 'utils/noop'
import logError from 'utils/log-error'

export const submitReport = (market, reportedOutcomeId, amountToStake, isIndeterminate, history, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (!loginAccount.address || !market || !reportedOutcomeId || !amountToStake) {
    return console.error('submitReport failed:', loginAccount.address, market, reportedOutcomeId, amountToStake)
  }
  const universeId = universe.id
  console.log(`submit report ${reportedOutcomeId} on market ${market.id} period ${universe.currentReportingWindowAddress}...`)
  const payoutNumerators = reportedOutcomeId // TODO convert reported outcome ID to payout numerators or just pass in payoutNumerators
  const report = {
    marketId: market.id,
    period: universe.currentReportingWindowAddress, // TODO replace .period with .reportingWindow
    reportedOutcomeId,
    isCategorical: market.type === CATEGORICAL,
    isScalar: market.type === SCALAR,
    isIndeterminate,
    isSubmitted: false,
  }
  dispatch(updateReport(universeId, market.id, { ...report }))
  augur.reporting.submitReport({
    meta: getState().loginAccount.meta,
    market: market.id,
    _payoutNumerators: payoutNumerators,
    _amountToStake: amountToStake,
    onSent: noop,
    onSuccess: () => {
      const { reports } = getState()
      dispatch(updateReport(universeId, market.id, { ...(reports[universeId] || {})[market.id], isSubmitted: true }))
      callback(null)
    },
    onFailed: (err) => {
      const { reports } = getState()
      dispatch(updateReport(universeId, market.id, { ...(reports[universeId] || {})[market.id], isSubmitted: false }))
      callback(err)
    },
  })
  dispatch(nextReportPage(history))
}
