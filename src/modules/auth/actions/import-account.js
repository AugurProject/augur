import { augur } from 'services/augurjs'
import { login } from 'modules/auth/actions/login'
import logError from 'utils/log-error'

export const importAccount = (password, keystore, callback = logError) => (dispatch, getState) => (
  augur.accounts.importAccount(password, keystore, (account) => {
    if (!account || !account.keystore) {
      callback(true)
      return console.error('importAccount failed:', account)
    }

    dispatch(login(keystore, password, err => callback(err)))
  })
)
