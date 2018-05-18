import { augur } from 'services/augurjs'
import speedomatic from 'speedomatic'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { formatGasCostToEther } from 'utils/format-number'
import { closeModal } from 'modules/modal/actions/close-modal'
import { loadReportingWindowBounds } from 'modules/reporting/actions/load-reporting-window-bounds'

export const purchaseParticipationTokens = (amount, estimateGas = false, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.reporting.getFeeWindowCurrent({ universe: universe.id }, (err, currFeeWindowInfo) => {
    if (err) return callback(err)
    const feeWindowAddress = currFeeWindowInfo.feeWindow
    if (feeWindowAddress == null) {
      augur.api.Universe.buyParticipationTokens({
        tx: {
          meta: loginAccount.meta,
          to: universe.id,
          estimateGas,
        },
        onSent: noop,
        onSuccess: (res) => {
          if (estimateGas) {
            const gasPrice = augur.rpc.getGasPrice()
            return callback(null, formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice))
          }
          return callback(null, res)
        },
        onFailed: err => callback(err),
      })
    } else {
      return dispatch(buyParticipationTokens(amount, feeWindowAddress, estimateGas, callback))
    }
  })
}

const buyParticipationTokens = (amount, feeWindowAddress, estimateGas = false, callback) => (dispatch, getState) => {
  const { loginAccount } = getState()
  augur.api.FeeWindow.buy({
    tx: {
      meta: loginAccount.meta,
      to: feeWindowAddress,
      estimateGas,
    },
    _attotokens: speedomatic.fix(amount, 'hex'),
    onSent: () => {
      // need fee window to do gas estimate
      if (!estimateGas) dispatch(closeModal())
    },
    onSuccess: (res) => {
      if (estimateGas) {
        const gasPrice = augur.rpc.getGasPrice()
        return callback(null, formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice))
      }
      dispatch(loadReportingWindowBounds())
      return callback(null, res)
    },
    onFailed: err => callback(err),
  })
}
