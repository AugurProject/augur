import { updateLoginAccount } from "modules/auth/actions/update-login-account";

import logError from "utils/log-error";
import {
  getRepBalance,
  getEthBalance,
  getDaiBalance
} from "modules/contracts/actions/contractCalls";

export function updateAssets(callback = logError) {
  return async (dispatch, getState) => {
    const { loginAccount } = getState();
    const balances = { eth: undefined, rep: undefined, dai: undefined };

    if (!loginAccount.address) return dispatch(updateLoginAccount(balances));
    const rep = await getRepBalance(loginAccount.address);
    const dai = await getDaiBalance(loginAccount.address);
    const eth = await getEthBalance(loginAccount.address);
    dispatch(updateLoginAccount({ rep, eth, dai }));
    callback();
  };
}
