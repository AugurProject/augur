import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { loadAccountOrders } from 'modules/bids-asks/actions/load-account-orders'
import isMetaMask from 'modules/auth/helpers/is-meta-mask'
import logError from 'utils/log-error'

const updateIsLoggedAndLoadAccountData = unlockedAddress => (dispatch) => {
  augur.rpc.clear() // clear ethrpc transaction history, registered callbacks, and notifications
  console.log(`using unlocked account ${unlockedAddress}`)
  dispatch(updateIsLogged(true))
  dispatch(loadAccountData({
    address: unlockedAddress,
    meta: {
      address: unlockedAddress,
      signer: null,
      accountType: augur.rpc.constants.ACCOUNT_TYPES.UNLOCKED_ETHEREUM_NODE
    },
    isUnlocked: true
  }, true))
  dispatch(loadAccountOrders())
}

// Use unlocked local address (if actually unlocked)
export const useUnlockedAccount = (unlockedAddress, callback = logError) => (dispatch) => {
  if (!unlockedAddress) return callback('no account address')
  if (isMetaMask()) return dispatch(updateIsLoggedAndLoadAccountData(unlockedAddress))
  augur.rpc.isUnlocked(unlockedAddress, (isUnlocked) => {
    if (!isUnlocked || isUnlocked.error) {
      console.warn(`account ${unlockedAddress} is locked`)
      return callback(null)
    }
    dispatch(updateIsLoggedAndLoadAccountData(unlockedAddress))
    callback(null)
  })
}
