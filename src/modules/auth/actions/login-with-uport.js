import { augur } from 'services/augurjs'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { uPortSigner } from 'modules/auth/helpers/uport-signer'

export const loginWithUport = account => (dispatch) => {
  dispatch(updateIsLogged(true))
  dispatch(loadAccountData({
    ...account,
    meta: {
      address: account.address,
      signer: transaction => dispatch(uPortSigner(transaction)),
      accountType: augur.rpc.constants.ACCOUNT_TYPES.U_PORT,
    },
  }))
}
