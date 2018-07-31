import { augur } from 'services/augurjs'
import { REPORTING_REPORT_MARKETS } from 'modules/routes/constants/views'
import makePath from 'modules/routes/helpers/make-path'
import logError from 'utils/log-error'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'

export const submitInitialReport = (estimateGas, marketId, selectedOutcome, invalid, history, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState()
  const outcome = parseFloat(selectedOutcome)

  if (!marketId || (isNaN(outcome) && !invalid)) return callback(null)

  const market = marketsData[marketId]
  if (!market) return callback('Market not found')
  const payoutNumerators = getPayoutNumerators(market, selectedOutcome, invalid)

  augur.api.Market.doInitialReport({
    meta: loginAccount.meta,
    tx: { to: marketId, estimateGas },
    _invalid: invalid,
    _payoutNumerators: payoutNumerators,
    onSent: () => {
      if (!estimateGas) {
        history.push(makePath(REPORTING_REPORT_MARKETS))
      }
    },
    onSuccess: (gasCost) => {
      if (estimateGas) {
        callback(null, gasCost)
      } else {
        callback(null)
      }
    },
    onFailed: err => callback(err),
  })
}
