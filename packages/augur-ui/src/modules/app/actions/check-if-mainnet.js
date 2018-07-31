import { getAugurNodeNetworkId } from 'modules/app/actions/get-augur-node-network-id'
import logError from 'utils/log-error'

export const checkIfMainnet = (callback = logError) => (dispatch) => {
  dispatch(getAugurNodeNetworkId((err, augurNodeNetworkId) => {
    if (err) return callback(err)
    if (augurNodeNetworkId === '1') { // If any other networkId being used is 1 but this isnt we'll get a different error dialog anyway
      return callback(null, true)
    }
    callback(null, false)
  }))
}
