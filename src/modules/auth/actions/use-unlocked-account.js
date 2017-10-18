import { augur } from 'services/augurjs'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'

import { constants as ETHRPC_CONSTANTS } from 'ethrpc'

// Use unlocked local address (if actually unlocked)
export const useUnlockedAccount = unlockedAddress => (dispatch) => {
  if (!unlockedAddress) return console.error('no account address')
  augur.rpc.isUnlocked(unlockedAddress, (isUnlocked) => {
    if (!isUnlocked || isUnlocked.error) {
      return console.warn('account is locked:', unlockedAddress, isUnlocked)
    }
    augur.accounts.logout() // clear the client-side account
    console.log('using unlocked account:', unlockedAddress)
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({
      meta: {
        signer: null,
        accountType: ETHRPC_CONSTANTS.ACCOUNT_TYPES.UNLOCKED_ETHEREUM_NODE
      },
      keystore: {
        address: unlockedAddress
      },
      isUnlocked: true
    }, true))
  })
}
