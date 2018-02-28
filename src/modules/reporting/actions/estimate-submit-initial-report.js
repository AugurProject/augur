import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'

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
