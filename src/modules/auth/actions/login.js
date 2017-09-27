import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLoggedIn } from 'modules/auth/actions/update-is-logged-in'
import logError from 'utils/log-error'

export const login = (loginID, password, callback = logError) => (dispatch, getState) => {
  const accountObject = base58Decode(loginID)
  if (!accountObject || !accountObject.keystore) {
    return callback({ code: 0, message: 'could not decode login ID' })
  }
  augur.accounts.login({ keystore: accountObject.keystore, password }, (err, account) => {
    if (err) return callback(err)
    if (account && !account.address) return callback(account)
    dispatch(updateIsLoggedIn(true))
    dispatch(loadAccountData({ ...account, loginID, name: accountObject.name }, true))
    callback(null)
  })
}
