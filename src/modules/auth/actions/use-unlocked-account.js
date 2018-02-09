import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import logError from 'utils/log-error'

const updateAccount = unlockedAddress => (dispatch) => {
  augur.accounts.logout() // clear the client-side account
  console.log('using unlocked account:', unlockedAddress)
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
}

// Use unlocked local address (if actually unlocked)
export const useUnlockedAccount = (unlockedAddress, callback = logError) => (dispatch) => {
  if (!unlockedAddress) return callback('no account address')
  if (typeof window !== 'undefined' && (((window || {}).web3 || {}).currentProvider || {}).isMetaMask) {
    return dispatch(updateAccount(unlockedAddress))
  }
  augur.rpc.isUnlocked(unlockedAddress, (isUnlocked) => {
    if (!isUnlocked || isUnlocked.error) {
      console.warn('account is locked:', unlockedAddress, isUnlocked)
      return callback(null)
    }
    dispatch(updateAccount(unlockedAddress))
    callback(null)
  })
}
