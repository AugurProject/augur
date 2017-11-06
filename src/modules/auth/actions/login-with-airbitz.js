import secureRandom from 'secure-random'
import { augur } from 'services/augurjs'
import { AIRBITZ_WALLET_TYPE } from 'modules/auth/constants/auth-types'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
import { constants as ETHRPC_CONSTANTS } from 'ethrpc'

export const loginWithAirbitzEthereumWallet = (airbitzAccount, ethereumWallet, history) => (dispatch) => {
  const privateKey = ethereumWallet.keys.ethereumKey
  const account = augur.accounts.loginWithMasterKey({ privateKey })

  if (!account.address) return console.error(account)

  dispatch(updateIsLogged(true))
  dispatch(loadAccountData({
    ...account,
    meta: {
      signer: privateKey,
      accountType: ETHRPC_CONSTANTS.ACCOUNT_TYPES.PRIVATE_KEY
    },
    name: airbitzAccount.username,
    airbitzAccount
  }, true))
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
