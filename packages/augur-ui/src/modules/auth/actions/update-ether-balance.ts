import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import getEtherBalance from "modules/auth/actions/get-ether-balance";
import logError from "utils/log-error";

export const updateEtherBalance = (callback: Function = logError) => (
  dispatch: Function,
  getState: Function
) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  getEtherBalance(loginAccount.address, (err: any, etherBalance: String) => {
    if (err) console.log("Could not get ether balance", loginAccount.address);
    if (!loginAccount.eth || loginAccount.eth !== etherBalance) {
      dispatch(updateLoginAccount({ eth: etherBalance }));
    }
    callback(null, etherBalance);
  });
};
