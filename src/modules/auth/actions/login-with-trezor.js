import { augur } from 'services/augurjs'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import trezorSigner from 'modules/auth/helpers/trezor-signer'
import { toChecksumAddress } from 'ethereumjs-util'

export default function loginWithTrezor(address, connect, addressPath) {
  return (dispatch) => {
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      address,
      displayAddress: toChecksumAddress(address),
      meta: {
        address,
        signer: async (...args) => {
          trezorSigner(connect, addressPath, dispatch, args)
        },
        accountType: augur.rpc.constants.ACCOUNT_TYPES.TREZOR,
      },
    }))
  }
}
