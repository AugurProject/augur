import secureRandom from 'secure-random'
import { augur } from 'services/augurjs'
import { AIRBITZ_WALLET_TYPE } from 'modules/auth/constants/auth-types'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLoggedIn } from 'modules/auth/actions/update-is-logged-in'

import makePath from 'modules/routes/helpers/make-path'

import { DEFAULT_VIEW } from 'modules/routes/constants/views'

export const loginWithAirbitzEthereumWallet = (airbitzAccount, ethereumWallet, history) => (dispatch) => {
  const masterPrivateKey = ethereumWallet.keys.ethereumKey
  augur.accounts.loginWithMasterKey(masterPrivateKey, (account) => {
    if (!account || !account.address || account.error) {
      return console.error(account)
    }
    dispatch(updateIsLogged(true))
    dispatch(loadAccountData({ ...account, name: airbitzAccount.username, airbitzAccount }, true))
    history.push(makePath(DEFAULT_VIEW))
  })
}

// Create an ethereum wallet if one doesn't exist
export const loginWithAirbitz = (airbitzAccount, history) => (dispatch) => {
  const ethereumWallet = airbitzAccount.getFirstWallet(AIRBITZ_WALLET_TYPE)
  if (ethereumWallet != null) {
    return dispatch(loginWithAirbitzEthereumWallet(airbitzAccount, ethereumWallet, history))
  }
  airbitzAccount.createWallet(AIRBITZ_WALLET_TYPE, { ethereumKey: new Buffer(secureRandom(32)).toString('hex') }, (err, id) => {
    if (err) return console.error({ code: 0, message: 'could not create wallet' })
    dispatch(loginWithAirbitzEthereumWallet(airbitzAccount, airbitzAccount.getWallet(id), history))
  })
}
