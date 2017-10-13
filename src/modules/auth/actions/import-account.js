import { augur } from 'services/augurjs'
import { login } from 'modules/auth/actions/login'
import logError from 'utils/log-error'

export const importAccount = (password, keystore, callback = logError) => (dispatch, getState) => (
  augur.accounts.importAccount({ password, keystore }, (err, account) => {
    if (err) return callback(err)

    dispatch(login(keystore, password, err => callback(err)))
  })
)
