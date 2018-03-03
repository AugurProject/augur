import { augur } from 'services/augurjs'
import { REPORTING_REPORT_MARKETS } from 'modules/routes/constants/views'
import makePath from 'modules/routes/helpers/make-path'
import logError from 'utils/log-error'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'

export const submitInitialReport = (marketId, selectedOutcome, invalid, history, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState()
  const outcome = parseInt(selectedOutcome, 10)

  if (!marketId || isNaN(outcome)) return callback(null)
  if (!invalid && outcome < 0) return callback(null)

  const market = marketsData[marketId]
  if (!market) return callback('Market not found')
  const payoutNumerators = getPayoutNumerators(market, selectedOutcome, invalid)

  augur.api.Market.doInitialReport({
    meta: loginAccount.meta,
    tx: { to: marketId },
    _invalid: invalid,
    _payoutNumerators: payoutNumerators,
    onSent: () => {
      history.push(makePath(REPORTING_REPORT_MARKETS))
    },
    onSuccess: () => callback(null),
    onFailed: (err) => {
      callback(err)
    },
  })
}
