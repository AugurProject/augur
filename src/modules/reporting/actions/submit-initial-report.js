import { augur } from 'services/augurjs'
import { REPORTING_REPORTING } from 'modules/routes/constants/views'
import makePath from 'modules/routes/helpers/make-path'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'

export const submitInitialReport = (marketId, selectedOutcome, invalid, history, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState()
  const outcome = parseInt(selectedOutcome, 10)

  if (marketId && (invalid || outcome > -1)) {
    const market = marketsData[marketId]
    if (!market) return callback('Market not found')
    const payoutNumerators = getPayoutNumerators(market, selectedOutcome, invalid)

    augur.api.Market.doInitialReport({
      meta: loginAccount.meta,
      tx: { to: marketId },
      _invalid: invalid,
      _payoutNumerators: payoutNumerators,
      onSent: () => {
        history.push(makePath(REPORTING_REPORTING))
      },
      onSuccess: () => callback(null),
      onFailed: (err) => {
        callback(err)
      }
    })
  }
}


export const estimateSubmitInitialReport = (marketId, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState()

  if (marketId) {
    const market = marketsData[marketId]
    if (!market) return callback('Market not found')
    const payoutNumerators = Array(market.numOutcomes).fill(0)
    payoutNumerators[0] = market.numTicks

    augur.api.Market.doInitialReport({
      meta: loginAccount.meta,
      tx: { to: marketId, estimateGas: true, gas: '0x632ea0' },
      _invalid: false,
      _payoutNumerators: payoutNumerators,
      onSent: noop,
      onSuccess: (gasCost) => {
        callback(null, gasCost)
      },
      onFailed: (err) => {
        callback(err)
      }
    })
  }
}
