import { toChecksumAddress } from 'ethereumjs-util'
import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { clearLoginAccount } from 'modules/auth/actions/update-login-account'

export const updateIsLoggedAndLoadAccountData = (unlockedAddress, accountType) => (dispatch) => {
  augur.rpc.clear() // clear ethrpc transaction history, registered callbacks, and notifications
  dispatch(clearLoginAccount()) // clear the loginAccount data in local state
  const displayAddress = toChecksumAddress(unlockedAddress)
  const address = unlockedAddress
  const loginAccount = {
    address,
    displayAddress,
    meta: { accountType, address, signer: null },
  }
  dispatch(updateIsLogged(true))
  dispatch(loadAccountData(loginAccount))
}
