import { augur } from 'services/augurjs'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { toChecksumAddress } from 'ethereumjs-util'
import ledgerSigner from 'modules/auth/helpers/ledger-signer'

export default function loginWithLedger(address, ledgerLib) {
  return (dispatch) => {
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      address,
      ledgerLib,
      displayAddress: toChecksumAddress(address),
      meta: {
        address,
        signer: async (...args) => {
          ledgerSigner(args, ledgerLib, dispatch)
        },
        accountType: augur.rpc.constants.ACCOUNT_TYPES.LEDGER,
      },
    }))
  }
}
