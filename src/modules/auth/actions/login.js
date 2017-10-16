import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'

import logError from 'utils/log-error'
import getValue from 'utils/get-value'

export const login = (keystore, password, callback = logError) => (dispatch, getState) => {
  console.log('keystore -- ', keystore, password)

  augur.accounts.login({ keystore, password }, (err, account) => {
    console.log('account -- ', err, account)

    if (err) return callback(err)
    if (!getValue(account, 'keystore.address')) return callback(null, account)

    dispatch(updateIsLogged(true))
    dispatch(loadAccountData(account, true))

    callback(null)
  })
}
