// import keythereum from 'keythereum'
// import secureRandom from 'secure-random'
// import speedomatic from 'speedomatic'
// import { augur } from 'services/augurjs'
// import { AIRBITZ_WALLET_TYPE } from 'modules/auth/constants/auth-types'
// import { loadAccountData } from 'modules/auth/actions/load-account-data'
// import { updateIsLogged } from 'modules/auth/actions/update-is-logged'
// import logError from 'utils/log-error'

// export const loginWithAirbitzEthereumWallet = (airbitzAccount, ethereumWallet, history) => (dispatch) => {
//   const privateKey = Buffer.from(ethereumWallet.keys.ethereumKey, 'hex')
//   const address = speedomatic.formatEthereumAddress(keythereum.privateKeyToAddress(privateKey))
//   dispatch(updateIsLogged(true))
//   dispatch(loadAccountData({
//     address,
//     privateKey,
//     meta: {
//       address,
//       signer: privateKey,
//       accountType: augur.rpc.constants.ACCOUNT_TYPES.PRIVATE_KEY,
//     },
//     name: airbitzAccount.username,
//     airbitzAccount,
//   }))
// }

// // Create an ethereum wallet if one doesn't exist
// export const loginWithAirbitz = (airbitzAccount, history, callback = logError) => (dispatch) => {
//   const ethereumWallet = airbitzAccount.getFirstWallet(AIRBITZ_WALLET_TYPE)
//   if (ethereumWallet != null) {
//     dispatch(loginWithAirbitzEthereumWallet(airbitzAccount, ethereumWallet, history))
//     return callback(null)
//   }
//   airbitzAccount.createWallet(AIRBITZ_WALLET_TYPE, { ethereumKey: Buffer.from(secureRandom(32)).toString('hex') }, (err, id) => {
//     if (err) return callback('could not create wallet')
//     dispatch(loginWithAirbitzEthereumWallet(airbitzAccount, airbitzAccount.getWallet(id), history))
//     callback(null)
//   })
// }
