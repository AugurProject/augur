import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import makePath from 'modules/routes/helpers/make-path'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'
import { REPORTING_DISPUTE_MARKETS } from 'modules/routes/constants/views'

export const submitMigrateREP = (estimateGas, marketId, selectedOutcome, invalid, amount, history, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData, universe } = getState()
  const outcome = parseFloat(selectedOutcome)
  const universeID = universe.id || UNIVERSE_ID

  if (!marketId || (isNaN(outcome) && !invalid)) return callback(null)

  const market = marketsData[marketId]
  if (!market) return callback('Market not found')
  const payoutNumerators = getPayoutNumerators(market, selectedOutcome, invalid)

  augur.api.Universe.getReputationToken({ tx: { to: universeID } }, (err, reputationTokenAddress) => {
    if (err) return callback(err)
    augur.api.ReputationToken.migrateOutByPayout({
      meta: loginAccount.meta,
      tx: { to: reputationTokenAddress, estimateGas },
      _invalid: invalid,
      _payoutNumerators: payoutNumerators,
      _attotokens: amount,
      onSent: () => {
        if (!estimateGas) {
          history.push(makePath(REPORTING_DISPUTE_MARKETS))
        }
      },
      onSuccess: (gasCost) => {
        if (estimateGas) {
          callback(null, gasCost)
        } else {
          callback(null)
        }
      },
      onFailed: (err) => {
        callback(err)
      },
    })
  })
}
