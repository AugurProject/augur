import crypto from 'crypto'
import keythereum from 'keythereum'
import secureRandom from 'secure-random'
import speedomatic from 'speedomatic'
import { augur } from 'services/augurjs'
import { EDGE_WALLET_TYPE } from 'modules/auth/constants/auth-types'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'

export const loginWithEdgeEthereumWallet = (
  edgeUiAccount,
  ethereumWallet,
  history,
) => (dispatch) => {
  const privateKey = Buffer.from(ethereumWallet.keys.ethereumKey, 'hex')
  const address = speedomatic.formatEthereumAddress(keythereum.privateKeyToAddress(privateKey))
  const derivedKey = crypto
    .createHash('sha256')
    .update(privateKey)
    .digest()

  dispatch(updateIsLogged(true))
  dispatch(loadAccountData({
    address,
    privateKey,
    derivedKey,
    meta: {
      address,
      signer: Buffer.from(privateKey, 'hex'),
      accountType: augur.rpc.constants.ACCOUNT_TYPES.PRIVATE_KEY,
    },
    name: edgeUiAccount.username,
    edgeUiAccount,
  }))
}

// Create an ethereum wallet if one doesn't exist
export const loginWithEdge = (edgeAccount, history) => (dispatch) => {
  const ethereumWallet = edgeAccount.getFirstWallet(EDGE_WALLET_TYPE)
  if (ethereumWallet != null) {
    return dispatch(loginWithEdgeEthereumWallet(edgeAccount, ethereumWallet, history))
  }
  edgeAccount
    .createWallet(EDGE_WALLET_TYPE, {
      ethereumKey: Buffer.from(secureRandom(32)).toString('hex'),
    })
    .then((id) => {
      dispatch(loginWithEdgeEthereumWallet(
        edgeAccount,
        edgeAccount.walletInfos[id],
        history,
      ))
    })
    .catch(e => console.error({ code: 0, message: 'could not create wallet' }))
}
