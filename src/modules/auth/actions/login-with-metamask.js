import logError from "utils/log-error";
import { augur } from "services/augurjs";
import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { first } from "lodash";
import { windowRef } from "utils/window-ref";

export const loginWithMetaMask = (callback = logError) => dispatch => {
  const failure = () => callback("NOT_SIGNED_IN");
  const success = account => {
    dispatch(useUnlockedAccount(account));
    callback(null, account);
  };
  augur.rpc.eth.accounts((err, accounts) => {
    const account = first(accounts);
    if (err) return failure();
    if (account) {
      success(account);
    } else {
      windowRef.ethereum
        .enable()
        .then(resolve => success(first(resolve)), failure);
    }
  });
};
