import { augur } from 'services/augurjs'
import { REPORTING_DISPUTE_MARKETS } from 'modules/routes/constants/views'
import makePath from 'modules/routes/helpers/make-path'
import logError from 'utils/log-error'
import { getPayoutNumerators } from 'modules/reporting/selectors/get-payout-numerators'
import { removeAccountDispute } from 'modules/reporting/actions/update-account-disputes'

export const submitMarketContribute = (marketId, selectedOutcome, invalid, amount, history, callback = logError) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState()
  const outcome = parseInt(selectedOutcome, 10)

  if (!marketId || (isNaN(outcome) && !invalid)) return callback(null)
  if (!invalid && outcome < 0) return callback(null)

  const market = marketsData[marketId]
  if (!market) return callback('Market not found')
  const payoutNumerators = getPayoutNumerators(market, selectedOutcome, invalid)

  augur.api.Market.contribute({
    meta: loginAccount.meta,
    tx: { to: marketId },
    _invalid: invalid,
    _payoutNumerators: payoutNumerators,
    _amount: amount,
    onSent: () => {
      history.push(makePath(REPORTING_DISPUTE_MARKETS))
    },
    onSuccess: () => {
      removeAccountDispute({ marketId })
      callback(null)
    },
    onFailed: (err) => {
      callback(err)
    },
  })
}
