import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { constants as ETHRPC_CONSTANTS } from 'ethrpc'

export default function loginWithUport(account, signer) {
  return (dispatch) => {
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      ...account,
      meta: {
        signer,
        accountType: ETHRPC_CONSTANTS.ACCOUNT_TYPES.U_PORT
      }
    }))
  }
}
