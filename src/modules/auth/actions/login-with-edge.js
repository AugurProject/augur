import { prefixHex } from 'speedomatic'
import { augur } from 'services/augurjs'
import { EDGE_WALLET_TYPE } from 'modules/auth/constants/auth-types'
import { loadAccountData } from 'modules/auth/actions/load-account-data'
import { updateIsLogged } from 'modules/auth/actions/update-is-logged'

export const loginWithEdgeEthereumWallet = (
  edgeUiAccount,
  ethereumWallet,
  history,
) => (dispatch) => {
  const address = ethereumWallet.keys.ethereumAddress

  dispatch(updateIsLogged(true))
  dispatch(loadAccountData({
    address,
    displayAddress: address,
    meta: {
      address,
      signer: (tx, callback) => {
        edgeUiAccount
          .signEthereumTransaction(ethereumWallet.id, tx)
          .then(signed => callback(null, prefixHex(signed)))
          .catch(e => callback(e))
      },
      accountType: augur.rpc.constants.ACCOUNT_TYPES.LEDGER,
    },
    name: edgeUiAccount.username,
    edgeUiAccount,
  }))
}

export const loginWithEdge = (edgeAccount, history) => (dispatch) => {
  const ethereumWallet = edgeAccount.getFirstWalletInfo(EDGE_WALLET_TYPE)
  if (ethereumWallet != null) {
    return dispatch(loginWithEdgeEthereumWallet(edgeAccount, ethereumWallet, history))
  }

  // Create an ethereum wallet if one doesn't exist
  edgeAccount
    .createCurrencyWallet(EDGE_WALLET_TYPE)
    .then(() => {
      const ethereumWallet = edgeAccount.getFirstWalletInfo(EDGE_WALLET_TYPE)
      dispatch(loginWithEdgeEthereumWallet(edgeAccount, ethereumWallet, history))
    })
    .catch(e => console.error({ code: 0, message: 'could not create wallet' }))
}
