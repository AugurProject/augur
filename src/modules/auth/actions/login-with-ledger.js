import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { constants as ETHRPC_CONSTANTS } from 'ethrpc'

export default function loginWithLedger(address, authLib) {
  return (dispatch) => {
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      address,
      authLib,
      meta: {
        signer: authLib.signTransactionByBip44Index,
        accountType: ETHRPC_CONSTANTS.ACCOUNT_TYPES.LEDGER
      }
    }))
  }
}
