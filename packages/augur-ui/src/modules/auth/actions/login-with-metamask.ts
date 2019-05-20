import logError from "utils/log-error";
import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { windowRef } from "utils/window-ref";
import { getAccounts } from "modules/contracts/actions/contractCalls";

export const loginWithMetaMask = (callback: Function = logError) => (
  dispatch: Function
) => {
  const failure = () => callback("NOT_SIGNED_IN");
  const success = (account: string) => {
    // make sure we actually have an account before succeeding...
    if (!account) return failure();
    dispatch(useUnlockedAccount(account));
    callback(null, account);
  };

  getAccounts().then((accounts: Array<string>) => {
    const account = accounts[0];
    if (account) {
      success(account);
    } else {
      windowRef.ethereum
        .enable()
        .then((resolve: Array<any>) => success(resolve[0]), failure);
    }
  }).catch((err: Error) => {
    if (err) return failure();
  });
};
