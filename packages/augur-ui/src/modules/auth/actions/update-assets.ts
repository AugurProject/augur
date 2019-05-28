import { LoginAccount } from "modules/types";
import {
  updateLoginAccount
} from "modules/account/actions/login-account";
import logError from "utils/log-error";
import {
  getEthBalance,
  getDaiBalance,
  getRepBalance
} from "modules/contracts/actions/contractCalls";

export function updateAssets(callback: Function = logError) {
  return async (dispatch: Function, getState: Function) => {
    const { loginAccount } = getState();
    const balances: LoginAccount = Object.assign(loginAccount, {
      eth: undefined,
      rep: undefined,
      dai: undefined,
    });

    if (!loginAccount.address)
      return dispatch(updateLoginAccount(balances));
    const { address } = loginAccount;
    balances.rep = await getRepBalance(address);
    balances.dai = await getDaiBalance(address);
    balances.eth = await getEthBalance(address);
    dispatch(updateLoginAccount(balances));
    callback(null, balances);
  };
}
