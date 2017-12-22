import { augur } from 'services/augurjs'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'

export default function loginWithLedger(address, authLib) {
  return (dispatch) => {
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      address,
      authLib,
      meta: {
        address,
        signer: authLib.signTransactionByBip44Index,
        accountType: augur.rpc.constants.ACCOUNT_TYPES.LEDGER
      }
    }))
  }
}
