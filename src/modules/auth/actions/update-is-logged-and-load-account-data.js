import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountOrders } from 'modules/bids-asks/actions/load-account-orders'

export const updateIsLoggedAndLoadAccountData = (unlockedAddress, accountType) => (dispatch) => {
  augur.rpc.clear() // clear ethrpc transaction history, registered callbacks, and notifications
  console.log(`using ${accountType} account ${unlockedAddress}`)
  const loginAccount = {
    address: unlockedAddress,
    meta: { accountType, address: unlockedAddress, signer: null },
  }
  dispatch(updateIsLogged(true))
  dispatch(loadAccountData(loginAccount))
  dispatch(loadAccountOrders())
}
