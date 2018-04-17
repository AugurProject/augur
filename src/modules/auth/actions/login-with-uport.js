import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { augur } from 'services/augurjs'
import uPortSigner from 'modules/auth/helpers/uport-signer'

export default function loginWithUport(account, signingFunction) {
  return (dispatch) => {
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      ...account,
      meta: {
        address: account.address,
        signer: txObj => uPortSigner(txObj, dispatch),
        accountType: augur.rpc.constants.ACCOUNT_TYPES.U_PORT,
      },
    }))
  }
}
