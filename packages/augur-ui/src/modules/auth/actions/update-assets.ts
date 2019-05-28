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
import { AppState } from "store";

export function updateAssets(callback: Function = logError) {
  return async (dispatch: Function, getState: () => AppState) => {
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
