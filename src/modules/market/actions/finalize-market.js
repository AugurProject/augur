import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { formatGasCostToEther } from 'utils/format-number'
import { closeModal } from 'modules/modal/actions/close-modal'

export const finalizeMarket = (marketId, estimateGas = false, callback = logError) => (dispatch, getState) => {
  augur.api.Market.finalize({
    tx: {
      to: marketId,
    },
    onSent: () => {
      console.log('sent finalize markey')
      // if we aren't estimatingGas, close the modal once the transaction is sent.
      if (!estimateGas) dispatch(closeModal())
    },
    onSuccess: (res) => {
      console.log(res)
      if (estimateGas) {
        // if just a gas estimate, return the gas cost.
        const gasPrice = augur.rpc.getGasPrice()
        return callback(null, formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice))
      }
      // if not a gas estimate, just return res and update markets.
      return callback(null, res)
      // update positions data?
    },
    onFailed: err => callback(err),
  })
}
