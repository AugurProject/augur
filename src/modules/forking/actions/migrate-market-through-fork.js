import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { formatGasCostToEther } from 'utils/format-number'
import { closeModal } from 'modules/modal/actions/close-modal'

export const migrateMarketThroughFork = (marketId, estimateGas = false, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState()
  augur.api.Market.migrateThroughOneFork({
    tx: {
      meta: loginAccount.meta,
      to: marketId,
      estimateGas,
    },
    onSent: () => {
      // if we aren't estimatingGas, close the modal once the transaction is sent.
      if (!estimateGas) dispatch(closeModal())
    },
    onSuccess: (res) => {
      if (estimateGas) {
        // if just a gas estimate, return the gas cost.
        const gasPrice = augur.rpc.getGasPrice()
        return callback(null, formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice))
      }
      return callback(null, res)
    },
    onFailed: err => callback(err),
  })
}
