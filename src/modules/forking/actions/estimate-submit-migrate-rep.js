import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'

export const estimateSubmitMigrateREP = (marketId, selectedOutcome, invalid, amount, history, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData, universe } = getState()
  const outcome = parseInt(selectedOutcome, 10)
  const universeID = universe.id || UNIVERSE_ID

  if (!marketId || (isNaN(outcome) && !invalid)) return callback(null)
  if (!invalid && outcome < 0) return callback(null)

  const market = marketsData[marketId]
  if (!market) return callback('Market not found')
  const payoutNumerators = getPayoutNumerators(market, selectedOutcome, invalid)

  augur.api.Universe.getReputationToken({ tx: { to: universeID } }, (err, reputationTokenAddress) => {
    if (err) return callback(err)
    augur.api.ReputationToken.migrateOutByPayout({
      meta: loginAccount.meta,
      tx: { to: reputationTokenAddress, estimateGas: true, gas: augur.constants.DEFAULT_MAX_GAS },
      _invalid: false,
      _payoutNumerators: payoutNumerators,
      _attotokens: amount,
      onSent: noop,
      onSuccess: (gasCost) => {
        callback(null, gasCost)
      },
      onFailed: (err) => {
        callback(err)
      },
    })
  })
}
