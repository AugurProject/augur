import logError from "utils/log-error";
import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { windowRef } from "utils/window-ref";
import { updateSdk } from "modules/auth/actions/update-sdk";
import { toChecksumAddress } from "ethereumjs-util";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";
import { Web3Provider } from "ethers/providers";
import { ACCOUNT_TYPES } from "modules/common/constants";

// MetaMask, dapper, Mobile wallets
export const loginWithInjectedWeb3 = (callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  const failure = () => callback("NOT_SIGNED_IN");
  const success = async (account: string) => {
    if (!account) return failure();

    const provider = new Web3Provider(window.web3.currentProvider);
    const networkId = window.web3.currentProvider.networkVersion;
    const isWeb3 = true;

    const accountObject = {
      address: account,
      displayAddress: toChecksumAddress(account),
      meta: {
        address: account,
        signer: provider.getSigner(),
        // TODO change constant for METAMASK, account for other injected web3 clients (i.e, dapper, coinbase wallet)
        accountType: ACCOUNT_TYPES.METAMASK,
        isWeb3,
      },
    };

    await dispatch(updateSdk(accountObject, networkId, provider));
    dispatch(useUnlockedAccount(account));
    callback(null, account);
  };

  windowRef.ethereum
    .enable()
    .then((resolve: string[]) => success(resolve[0]), failure);
};
