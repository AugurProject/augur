import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import logError from 'utils/log-error'

export const login = (keystore, password, callback = logError) => (dispatch, getState) => {
  augur.accounts.login({ keystore, password }, (err, account) => {
    if (err) return callback(err)
    if (account && !account.address) return callback(null, account)

    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({ ...keystore }, true))

    callback(null)
  })
}
