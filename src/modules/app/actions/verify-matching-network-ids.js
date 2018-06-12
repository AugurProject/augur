import { augur } from 'services/augurjs'
import { getAugurNodeNetworkId } from 'modules/app/actions/get-augur-node-network-id'
import isGlobalWeb3 from 'modules/auth/helpers/is-global-web3'
import logError from 'utils/log-error'

const allNetworkIdsMatch = (networkIds, callback = logError) => {
  const networkIdValues = Object.values(networkIds)
  if (networkIdValues.indexOf(null) > -1) {
    return callback(`One or more network IDs not found: ${JSON.stringify(networkIds)}`)
  }
  if (new Set(networkIdValues).size > 1) {
    console.error(`Network ID mismatch: ${JSON.stringify(networkIds)}`)
    return callback(null, networkIds.augurNode) // augur-node's network id is the expected network id
  }
  callback(null)
}

export const verifyMatchingNetworkIds = (callback = logError) => dispatch => dispatch(getAugurNodeNetworkId((err, augurNodeNetworkId) => {
  if (err) return callback(err)
  const networkIds = { augurNode: augurNodeNetworkId, middleware: augur.rpc.getNetworkID() }
  if (!isGlobalWeb3()) return allNetworkIdsMatch(networkIds, callback)
  augur.rpc.net.version((err, netVersion) => {
    if (err) return callback(err)
    networkIds.netVersion = netVersion
    allNetworkIdsMatch({ ...networkIds, netVersion }, callback)
  })
}))
