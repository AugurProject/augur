import logError from "utils/log-error";
import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { windowRef } from "utils/window-ref";
import { updateSdk } from "modules/auth/actions/update-sdk";
import { toChecksumAddress } from "ethereumjs-util";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";
import { Web3Provider } from "ethers/providers";

// MetaMask, dapper, Mobile wallets
export const loginWithInjectedWeb3 = (callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
) => {
  const failure = () => callback("NOT_SIGNED_IN");
  const success = async (account: string) => {
    if (!account) return failure();

    const provider = new Web3Provider(window.web3.currentProvider);
    const isWeb3 = true;

    const accountObject = {
      address: account,
      displayAddress: toChecksumAddress(account),
      meta: {
        address: account,
        signer: provider.getSigner(),
        accountType: "metaMask", // TODO replace reference with something more general
        isWeb3,
      },
    };

    await dispatch(updateSdk(accountObject, provider));
    dispatch(useUnlockedAccount(account));
    callback(null, account);
  };

  windowRef.ethereum
    .enable()
    .then((resolve: Array<string>) => success(resolve[0]), failure);
};
