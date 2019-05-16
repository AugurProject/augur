import { updateFromAddress } from "modules/contracts/actions/update-contract-api";
import { LOGIN_ACTIONS, LoginAccount, UpdateLoginAccountAction } from "modules/common/types/login-account";
import { voidFunction } from "modules/common/types";
export const CLEAR_LOGIN_ACCOUNT = "CLEAR_LOGIN_ACCOUNT";

export const updateLoginAccount = (loginAccount: LoginAccount) => (
  dispatch: Function,
) => {
  dispatch(UpdateLoginAccountAction(loginAccount));
  const { address } = loginAccount;
  if (address) dispatch(updateFromAddress(address));
};

export const clearLoginAccount = () => ({ type: LOGIN_ACTIONS.CLEAR_LOGIN_ACCOUNT });
