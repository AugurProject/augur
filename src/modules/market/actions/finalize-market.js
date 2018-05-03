import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { formatGasCostToEther } from 'utils/format-number'
import { closeModal } from 'modules/modal/actions/close-modal'
import noop from 'utils/noop'

export const sendFinalizeMarket = (marketId, callback = logError) => (dispatch, getState) => {
  console.log('finalize market called')
  const { loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  augur.reporting.finalizeMarket({
    market: marketId, 
    onSent: noop,
    onSuccess: (res) => {
      //do something
    },
    onFailed: err => callback(err),
  })
}
