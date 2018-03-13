import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export const getDisputeInfo = (marketId, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState()
  augur.augurNode.submitRequest(
    'getDisputeInfo',
    {
      marketIds: [marketId],
      account: loginAccount.address,
    }, (err, result) => {
      if (err) return callback(err)

      callback(result[0])
    },
  )
}
