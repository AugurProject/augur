import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { augur } from 'services/augurjs'

export default function loginWithUport(account, signer) {
  return (dispatch) => {
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      ...account,
      meta: {
        address: account.address,
        signer,
        accountType: augur.rpc.constants.ACCOUNT_TYPES.U_PORT
      }
    }))
  }
}
