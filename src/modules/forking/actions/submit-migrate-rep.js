import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'
import { updateAssets } from 'modules/auth/actions/update-assets'

export const submitMigrateREP = (marketId, selectedOutcome, invalid, amount, history, callback = logError) => (dispatch, getState) => {
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
      tx: { to: reputationTokenAddress },
      _invalid: invalid,
      _payoutNumerators: payoutNumerators,
      _attotokens: amount,
      onSent: () => callback(null),
      onSuccess: () => {
        dispatch(updateAssets())
        callback(null)
      },
      onFailed: (err) => {
        callback(err)
      },
    })
  })
}
