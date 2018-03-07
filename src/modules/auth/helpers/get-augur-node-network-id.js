import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export const getAugurNodeNetworkId = (callback = logError) => {
  augur.augurNode.getContractAddresses((err, contractAddresses) => {
    if (err) return callback(err)
    callback(null, contractAddresses.net_version)
  })
}
