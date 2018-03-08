import { augur } from 'services/augurjs'
import { updateAugurNodeNetworkId } from 'modules/app/actions/update-connection'
import logError from 'utils/log-error'

export const getAugurNodeNetworkId = (callback = logError) => (dispatch, getState) => {
  const { connection } = getState()
  if (connection.augurNodeNetworkId != null) return callback(null, connection.augurNodeNetworkId)
  augur.augurNode.getContractAddresses((err, contractAddresses) => {
    if (err) return callback(err)
    const augurNodeNetworkId = contractAddresses.net_version
    dispatch(updateAugurNodeNetworkId(augurNodeNetworkId))
    callback(null, augurNodeNetworkId)
  })
}
