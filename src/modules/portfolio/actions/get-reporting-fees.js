import { augur } from 'services/augurjs'
import logError from 'utils/log-error'


export const getReportingFees = (callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.augurNode.submitRequest(
    'getReportingFees',
    {
      universe: universe.id,
      reporter: loginAccount.address,
    }, (err, result) => {
      if (err) return callback(err)
      callback(null, result)
    },
  )
}
