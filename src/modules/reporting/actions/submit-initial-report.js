import { augur } from 'services/augurjs'
import noop from 'utils/noop'
import logError from 'utils/log-error'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'

export const submitInitialReport = (marketId, selectedOutcome, invalid, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState()
  if (marketId && selectedOutcome) {
    const market = marketsData[marketId]
    if (!market) return callback('Market not found')
    const payoutNumerators = getPayoutNumerators(market, selectedOutcome)

    augur.api.Market.doInitialReport({
      meta: loginAccount.meta,
      tx: { to: marketId },
      _invalid: invalid,
      _payoutNumerators: payoutNumerators,
      onSent: noop,
      onSuccess: () => callback(null),
      onFailed: (err) => {
        callback(err)
      }
    })
  }
}
