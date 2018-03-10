// import secureRandom from 'secure-random'
// import { augur } from 'services/augurjs'
// import { AIRBITZ_WALLET_TYPE } from 'modules/auth/constants/auth-types'
// import { loadAccountData } from 'modules/auth/actions/load-account-data'
// import { updateIsLogged } from 'modules/auth/actions/update-is-logged'

// export const loginWithAirbitzEthereumWallet = (airbitzAccount, ethereumWallet, history) => (dispatch) => {
//   const privateKey = ethereumWallet.keys.ethereumKey
//   const account = augur.accounts.loginWithMasterKey({ privateKey })

//   if (!account.address) return console.error(account)

//   dispatch(updateIsLogged(true))
//   dispatch(loadAccountData({
//     ...account,
//     meta: {
//       address: account.address,
//       signer: Buffer.from(privateKey, 'hex'),
//       accountType: augur.rpc.constants.ACCOUNT_TYPES.PRIVATE_KEY,
//     },
//     name: airbitzAccount.username,
//     airbitzAccount,
//   }))
// }

// // Create an ethereum wallet if one doesn't exist
// export const loginWithAirbitz = (airbitzAccount, history) => (dispatch) => {
//   const ethereumWallet = airbitzAccount.getFirstWallet(AIRBITZ_WALLET_TYPE)
//   if (ethereumWallet != null) {
//     return dispatch(loginWithAirbitzEthereumWallet(airbitzAccount, ethereumWallet, history))
//   }
//   airbitzAccount.createWallet(AIRBITZ_WALLET_TYPE, { ethereumKey: Buffer.from(secureRandom(32)).toString('hex') }, (err, id) => {
//     if (err) return console.error({ code: 0, message: 'could not create wallet' })
//     dispatch(loginWithAirbitzEthereumWallet(airbitzAccount, airbitzAccount.getWallet(id), history))
//   })
// }
