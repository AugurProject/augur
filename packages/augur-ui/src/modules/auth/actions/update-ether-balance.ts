import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import { getEthBalance } from "modules/contracts/actions/contractCalls";
import logError from "utils/log-error";

export const updateEtherBalance = (callback: Function = logError) => async (
  dispatch: Function,
  getState: Function
) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  const { balance } = await getEthBalance(loginAccount.address);
  dispatch(updateLoginAccount({ eth: balance }));
  callback(null, balance);
};
