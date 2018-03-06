import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'

export const estimateSubmitMarketContribute = (marketId, amount, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState()

  const market = marketsData[marketId]
  if (!market) return callback('Market not found')
  const payoutNumerators = Array(market.numOutcomes).fill(0)
  payoutNumerators[0] = market.numTicks

  augur.api.Market.contribute({
    meta: loginAccount.meta,
    tx: { to: marketId, estimateGas: true, gas: augur.constants.DEFAULT_MAX_GAS },
    _invalid: false,
    _payoutNumerators: payoutNumerators,
    _amount: amount,
    onSent: noop,
    onSuccess: (gasCost) => {
      callback(null, gasCost)
    },
    onFailed: (err) => {
      callback(err)
    },
  })

}
