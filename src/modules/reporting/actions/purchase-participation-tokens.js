import { augur } from 'services/augurjs'
import speedomatic from 'speedomatic'
import logError from 'utils/log-error'
import { formatGasCostToEther } from 'utils/format-number'
import { closeModal } from 'modules/modal/actions/close-modal'
import { loadReportingWindowBounds } from 'modules/reporting/actions/load-reporting-window-bounds'

export const purchaseParticipationTokens = (amount, estimateGas = false, callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  augur.reporting.getFeeWindowCurrent({ universe: universe.id }, (err, currFeeWindowInfo) => {
    if (err) return callback(err)
    let methodFunc = augur.api.FeeWindow.buy
    let address = currFeeWindowInfo.feeWindow
    if (address == null) {
      methodFunc = augur.api.Universe.buyParticipationTokens
      address = universe.id
    }
    return dispatch(callMethod(methodFunc, amount, address, estimateGas, callback))
  })
}

const callMethod = (method, amount, address, estimateGas = false, callback) => (dispatch, getState) => {
  const { loginAccount } = getState()
  method({
    tx: {
      meta: loginAccount.meta,
      to: address,
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
