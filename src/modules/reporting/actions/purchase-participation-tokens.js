import { augur } from 'services/augurjs'
import BigNumber from 'bignumber.js'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { formatGasCostToEther } from 'utils/format-number'

export const purchaseParticipationTokens = (amount, estimateGas = false, callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  augur.reporting.getFeeWindowCurrent({ universe: universe.id }, (err, currFeeWindowInfo) => {
    if (err) return callback(err)
    const feeWindowAddress = currFeeWindowInfo.feeWindow
    augur.api.FeeWindow.buy({
      tx: {
        to: feeWindowAddress,
        estimateGas,
      },
      _attotokens: new BigNumber(amount, 10).toFixed(),
      onSent: noop,
      onSuccess: (res) => {
        if (estimateGas) {
          // if just a gas estimate, return the gas cost.
          const gasPrice = augur.rpc.getGasPrice()
          return callback(null, formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice))
        }
        // if not a gas estimate, just return res.
        return callback(null, res)
      },
      onFailed: err => callback(err),
    })
  })
}
