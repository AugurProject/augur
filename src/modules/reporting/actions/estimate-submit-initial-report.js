import { augur } from 'services/augurjs'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'
import logError from 'utils/log-error'
import noop from 'utils/noop'

export const estimateSubmitInitialReport = (marketId, selectedOutcome, invalid, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState()
  const outcome = parseInt(selectedOutcome, 10)

  if (!marketId || (isNaN(outcome) && !invalid)) return callback(null)
  if (!invalid && outcome < 0) return callback(null)

  const market = marketsData[marketId]
  if (!market) return callback('Market not found')
  const payoutNumerators = getPayoutNumerators(market, selectedOutcome, invalid)

  augur.api.Market.doInitialReport({
    meta: loginAccount.meta,
    tx: { to: marketId, estimateGas: true, gas: augur.constants.DEFAULT_MAX_GAS },
    _invalid: false,
    _payoutNumerators: payoutNumerators,
    onSent: noop,
    onSuccess: gasCost => callback(null, gasCost),
    onFailed: err => callback(err),
  })
}
