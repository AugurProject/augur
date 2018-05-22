import { augur } from 'services/augurjs'
import logError from 'src/utils/log-error'

export const loadUsershareBalances = ({ market }, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState()
  if (loginAccount.address == null) return callback(null)
  augur.augurNode.submitRequest('getUserShareBalances', {
    marketIds: [
      market,
    ],
    account: loginAccount.address,
  }, (err, data) => {
    if (err) return callback(err)
    callback(null, data[market])
  })

}

export default loadUsershareBalances
