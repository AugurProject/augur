import { LoginAccount, BaseAction } from "modules/types";

export const UPDATE_LOGIN_ACCOUNT = "UPDATE_LOGIN_ACCOUNT";
export const CLEAR_LOGIN_ACCOUNT = "CLEAR_LOGIN_ACCOUNT";

export function updateLoginAccountAction(data: LoginAccount): BaseAction {
  return {
    type: UPDATE_LOGIN_ACCOUNT,
    data
  };
}

export function clearLoginAccountAction(data: LoginAccount): BaseAction {
  return {
    type: CLEAR_LOGIN_ACCOUNT,
    data
  };
}
