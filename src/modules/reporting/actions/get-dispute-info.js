import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export const getDisputeInfo = (marketIds, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState()
  augur.augurNode.submitRequest(
    'getDisputeInfo',
    {
      marketIds,
      account: loginAccount.address,
    }, (err, result) => {
      if (err) return callback(err)

      callback(null, result)
    },
  )
}
