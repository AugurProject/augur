import { toChecksumAddress } from 'ethereumjs-util'
import { decode } from 'mnid'
import { augur } from 'services/augurjs'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { uPortSigner } from 'modules/auth/helpers/uport-signer'

export const loginWithUport = (credentials, uPort) => (dispatch) => {
  const account = decode(credentials.address)
  dispatch(updateIsLogged(true))
  dispatch(loadAccountData({
    ...account,
    displayAddress: toChecksumAddress(account.address),
    meta: {
      address: account.address,
      signer: transaction => dispatch(uPortSigner(uPort, transaction)),
      accountType: augur.rpc.constants.ACCOUNT_TYPES.U_PORT,
    },
  }))
}
