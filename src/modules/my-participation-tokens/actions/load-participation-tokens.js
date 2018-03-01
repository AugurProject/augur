import noop from 'utils/noop'
import logError from 'utils/log-error'
import speedomatic from 'speedomatic'
import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { updateParticipationTokensData, updateParticipationTokensEscapeHatchGasCost } from './update-participation-tokens'

export default (includeCurrent = true, callback = logError) => (dispatch, getState) => {
  const { loginAccount, universe } = getState()
  const universeID = universe.id || UNIVERSE_ID

  augur.augurNode.submitRequest('getFeeWindows', { universe: universeID, account: loginAccount.address, includeCurrent }, (err, feeWindowsWithUnclaimedTokens) => {
    if (err) return callback(err)
    dispatch(updateParticipationTokensData(feeWindowsWithUnclaimedTokens))
    Object.keys(feeWindowsWithUnclaimedTokens).forEach((feeWindowID) => {
      augur.api.FeeWindow.withdrawInEmergency({
        tx: { estimateGas: true, to: feeWindowID },
        onSent: noop,
        onSuccess: (attoGasCost) => {
          const gasCost = speedomatic.encodeNumberAsJSNumber(attoGasCost)
          dispatch(updateParticipationTokensEscapeHatchGasCost(feeWindowID, gasCost))
        },
        onFailed: callback,
      })
    })
    callback(null, feeWindowsWithUnclaimedTokens)
  })
}
