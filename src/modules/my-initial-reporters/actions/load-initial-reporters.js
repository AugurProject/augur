import speedomatic from 'speedomatic'
import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { updateInitialReportersData, updateInitialReportersEscapeHatchGasCost } from './update-initial-reporters'
import noop from 'utils/noop'
import logError from 'utils/log-error'

export default (callback = logError) => (dispatch, getState) => {
  const { loginAccount, universe } = getState()
  const universeID = universe.id || UNIVERSE_ID
  
  augur.augurNode.submitRequest('getInitialReporters', { reporter: loginAccount.address, redeemed: false, withRepBalance: true }, (err, initialReporters) => {
    if (err) return callback(err)
    dispatch(updateInitialReportersData(initialReporters))
    Object.keys(initialReporters).forEach((initialReporterID) => {
      augur.api.InitialReporter.withdrawInEmergency({
        tx: { estimateGas: true, to: initialReporterID },
        onSent: noop,
        onSuccess: (attoGasCost) => {
          const gasCost = speedomatic.encodeNumberAsJSNumber(attoGasCost);
          dispatch(updateInitialReportersEscapeHatchGasCost(initialReporterID, gasCost))
        },
        onFailed: callback
      })
    })
    callback(null, initialReporters)
  })
}