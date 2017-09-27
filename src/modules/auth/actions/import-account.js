import { augur } from 'services/augurjs'
import { login } from 'modules/auth/actions/login'
import logError from 'utils/log-error'

export const importAccount = (password, keystore, callback = logError) => (dispatch, getState) => (
  augur.accounts.importAccount({ password, keystore }, (err, account) => {
    if (err) return callback(err)
    if (!account || !account.keystore) {
      console.error('importAccount failed:', account)
      return callback(true)
    }

    dispatch(login(keystore, password, err => callback(err)))
  })
)
