import { augur } from 'services/augurjs'
import { base58Encode } from 'utils/base-58'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLoggedIn } from 'modules/auth/actions/update-is-logged-in'
import logError from 'utils/log-error'

export const importAccount = (password, keystore, callback = logError) => (dispatch, getState) => (
  augur.accounts.importAccount({ password, keystore }, (err, account) => {
    if (err) return callback(err)
    if (!account || !account.keystore) {
      console.error('importAccount failed:', account)
      return callback(true)
    }

    dispatch(updateIsLoggedIn(true))
    const loginID = base58Encode(account)
    dispatch(loadAccountData({ ...account, loginID }, true))
    callback(null)
  })
)
