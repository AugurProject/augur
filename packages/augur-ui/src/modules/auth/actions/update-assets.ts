import { LoginAccount } from "modules/types";
import {
  updateLoginAccountAction
} from "modules/account/actions/login-account";
import logError from "utils/log-error";
import {
  getEthBalance,
  getDaiBalance,
  getRepBalance
} from "src/modules/contracts/actions/contractCalls";

export function updateAssets(callback: Function = logError) {
  return async (dispatch: Function, getState: Function) => {
    const { loginAccount } = getState();
    let balances: LoginAccount = {
      eth: undefined,
      rep: undefined,
      dai: undefined
    };

    if (!loginAccount.address)
      return dispatch(updateLoginAccountAction(balances));
    const { address } = loginAccount;
    const rep = await getRepBalance(address);
    const dai = await getDaiBalance(address);
    const { balance: eth } = await getEthBalance(address);
    balances = { rep, eth, dai };
    dispatch(updateLoginAccountAction(balances));
    callback(null, balances);
  };
}
