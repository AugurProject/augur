import logError from "utils/log-error";
import { augur } from "services/augurjs";
import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { first } from "lodash";

export const loginWithMetaMask = (callback = logError) => dispatch => {
  augur.rpc.eth.accounts((err, accounts) => {
    const account = first(accounts);
    if (err || !account) return callback("NOT_SIGNED_IN");
    dispatch(useUnlockedAccount(account));
    callback(null, account);
  });
};
