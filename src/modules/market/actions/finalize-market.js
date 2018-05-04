import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'

export const sendFinalizeMarket = (marketId, callback = logError) => (dispatch, getState) => {
  console.log('finalize market called')
  const { loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  augur.api.Market.finalize({ tx: { to: marketId },
    onSent: noop,
    onSuccess: noop,
    onFailed: err => callback(err),
  })
}
