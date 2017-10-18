import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { constants as ETHRPC_CONSTANTS } from 'ethrpc'

import logError from 'utils/log-error'
import getValue from 'utils/get-value'

export const login = (keystore, password, callback = logError) => (dispatch, getState) => {
  augur.accounts.login({ keystore, password }, (err, account) => {
    const address = getValue(account, 'keystore.address')
    if (err) return callback(err)
    if (!address) return callback(null, account)

    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      ...account,
      address,
      meta: {
        signer: account.privateKey,
        accountType: ETHRPC_CONSTANTS.ACCOUNT_TYPES.PRIVATE_KEY
      }
    }, true))

    callback(null)
  })
}
