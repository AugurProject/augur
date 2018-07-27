import noop from 'utils/noop'
import logError from 'utils/log-error'
import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { updateDisputeCrowdsourcersData } from './update-dispute-crowdsourcer-tokens'

export default (callback = logError) => (dispatch, getState) => {
  const { loginAccount, universe } = getState()
  const universeID = universe.id || UNIVERSE_ID

  augur.augurNode.submitRequest('getDisputeTokens', { universe: universeID, account: loginAccount.address }, (err, disputeCrowdsourcerTokens) => {
    if (err) return callback(err)
    dispatch(updateDisputeCrowdsourcersData(disputeCrowdsourcerTokens))
    Object.keys(disputeCrowdsourcerTokens).forEach((disputeCrowdsourcerID) => {
      augur.api.DisputeCrowdsourcer.withdrawInEmergency({
        tx: { estimateGas: true, to: disputeCrowdsourcerID },
        meta: loginAccount.meta,
        onSent: noop,
        onFailed: callback,
      })
    })
    callback(null, disputeCrowdsourcerTokens)
  })
}
