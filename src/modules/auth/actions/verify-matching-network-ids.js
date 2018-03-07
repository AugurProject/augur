import { augur } from 'services/augurjs'
import { getAugurNodeNetworkId } from 'modules/auth/helpers/get-augur-node-network-id'
import { getMetaMaskNetworkId } from 'modules/auth/helpers/get-meta-mask-network-id'
import isMetaMask from 'modules/auth/helpers/is-meta-mask'
import logError from 'utils/log-error'

export const verifyMatchingNetworkIds = (callback = logError) => {
  getAugurNodeNetworkId((err, augurNodeNetworkId) => {
    if (err) return callback(err)
    const networkIds = { augurNode: augurNodeNetworkId, middleware: augur.rpc.getNetworkID() }
    if (isMetaMask()) networkIds.metaMask = getMetaMaskNetworkId()
    const networkIdValues = Object.values(networkIds)
    if (networkIdValues.indexOf(null) > -1) {
      return callback(`One or more network IDs not found: ${JSON.stringify(networkIds)}`)
    }
    if (new Set(networkIdValues).size > 1) {
      console.error(`Network ID mismatch: ${JSON.stringify(networkIds)}`)
      return callback(null, false)
    }
    callback(null, true)
  })
}
