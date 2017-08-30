import { augur } from 'services/augurjs'
import { base58Encode } from 'utils/base-58'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'

export const importAccount = (password, keystore, callback) => (dispatch, getState) => (
  augur.accounts.importAccount(password, keystore, (account) => {
    if (!account || !account.keystore) {
      callback && callback(true)
      return console.error('importAccount failed:', account)
    }

    dispatch(updateIsLogged(true))
    const loginID = base58Encode(account)
    dispatch(loadAccountData({ ...account, loginID }, true))
    callback && callback()
  })
)
