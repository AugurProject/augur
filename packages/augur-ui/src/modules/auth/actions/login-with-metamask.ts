import logError from "utils/log-error";
import { augur } from "services/augurjs";
import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { windowRef } from "utils/window-ref";

export const loginWithMetaMask = (callback: Function = logError) => (
  dispatch: Function
) => {
  const failure = () => callback("NOT_SIGNED_IN");
  const success = (account: String) => {
    // make sure we actually have an account before succeeding...
    if (!account) return failure();
    dispatch(useUnlockedAccount(account));
    callback(null, account);
  };
  augur.rpc.eth.accounts((err: any, accounts: Array<String>) => {
    const account = accounts[0];
    if (err) return failure();
    if (account) {
      success(account);
    } else {
      windowRef.ethereum
        .enable()
        .then((resolve: Array<any>) => success(resolve[0]), failure);
    }
  });
};
