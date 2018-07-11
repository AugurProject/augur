import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addCompleteSetsSoldLogs } from 'modules/transactions/actions/add-transactions'

export function loadAccountCompleteSets(options = {}, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    const { address } = loginAccount
    if (address == null) return callback(null)
    augur.augurNode.submitRequest('getCompleteSets', { account: address }, (err, completeSetsLogs) => {
      if (err) callback(err)
      dispatch(addCompleteSetsSoldLogs(completeSetsLogs))
      callback(null, completeSetsLogs)
    })
  }
}
