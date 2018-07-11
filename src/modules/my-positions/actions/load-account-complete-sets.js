import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addCompleteSetsSoldLogs } from 'modules/transactions/actions/add-transactions'

export function loadAccountCompleteSets(options = {}, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount, universe } = getState()
    const { address } = loginAccount
    const { id } = universe
    if (address == null) return callback(null)
    augur.augurNode.submitRequest('getCompleteSets', { account: address, universe: id }, (err, completeSetsLogs) => {
      if (err) callback(err)
      console.log(err, completeSetsLogs);
      dispatch(addCompleteSetsSoldLogs(completeSetsLogs))
      callback(null, completeSetsLogs)
    })
  }
}
