import noop from 'utils/noop'
import logError from 'utils/log-error'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { augur } from 'services/augurjs'
import { updateInitialReportersData } from './update-initial-reporters'

export default (callback = logError) => (dispatch, getState) => {
  const { loginAccount, universe } = getState()
  const universeID = universe.id || UNIVERSE_ID

  augur.augurNode.submitRequest('getInitialReporters', { universe: universeID, reporter: loginAccount.address, redeemed: false, withRepBalance: true }, (err, initialReporters) => {
    if (err) return callback(err)
    dispatch(updateInitialReportersData(initialReporters))
    Object.keys(initialReporters).forEach((initialReporterID) => {
      augur.api.InitialReporter.withdrawInEmergency({
        tx: { estimateGas: true, to: initialReporterID },
        meta: loginAccount.meta,
        onSent: noop,
        onSuccess: noop,
        onFailed: callback,
      })
    })
    callback(null, initialReporters)
  })
}
