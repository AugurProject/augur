import { EDGE_WALLET_TYPE, ACCOUNT_TYPES } from "modules/common/constants";
import logError from "utils/log-error";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { updateSdk } from "modules/auth/actions/update-sdk";
import EdgeSigner from "modules/auth/helpers/edge-signer";
import { EdgeUiAccount, EthereumWallet } from "modules/types";

export const loginWithEdgeEthereumWallet = (
  edgeUiAccount: EdgeUiAccount,
  ethereumWallet: EthereumWallet
) => async (dispatch: ThunkDispatch<void, any, Action>) => {
  const mixedCaseAddress: string = ethereumWallet.keys.ethereumAddress;
  const lowerCaseAddress: string = mixedCaseAddress.toLowerCase();
  const edgeSigner = new EdgeSigner(edgeUiAccount, ethereumWallet);

  const loginAccount = {
    address: lowerCaseAddress,
    mixedCaseAddress: mixedCaseAddress,
    meta: {
      address: lowerCaseAddress,
      signer: edgeSigner,
      accountType: ACCOUNT_TYPES.EDGE,
      isWeb3: false,
    },
    name: edgeUiAccount.username,
    edgeUiAccount,
  };

  dispatch(updateSdk(loginAccount, undefined));

};

export const loginWithEdge = (
  edgeAccount: EdgeUiAccount
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  const ethereumWallet = edgeAccount.getFirstWalletInfo(EDGE_WALLET_TYPE);
  if (ethereumWallet != null) {
    return dispatch(
      loginWithEdgeEthereumWallet(edgeAccount, ethereumWallet)
    );
  }

  // Create an ethereum wallet if one doesn't exist
  edgeAccount
    .createCurrencyWallet(EDGE_WALLET_TYPE)
    .then(() => {
      const ethereumWallet = edgeAccount.getFirstWalletInfo(EDGE_WALLET_TYPE);
      return dispatch(
        loginWithEdgeEthereumWallet(edgeAccount, ethereumWallet)
      );
    })
    .catch(() => logError({ code: 0, message: "could not create wallet" }));
};
