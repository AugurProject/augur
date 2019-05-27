import { LoginAccount, BaseAction } from "modules/types";

export const UPDATE_LOGIN_ACCOUNT = "UPDATE_LOGIN_ACCOUNT";
export const CLEAR_LOGIN_ACCOUNT = "CLEAR_LOGIN_ACCOUNT";

export function updateLoginAccount(data: Partial<LoginAccount>): BaseAction {
  return {
    type: UPDATE_LOGIN_ACCOUNT,
    data
  };
}

export function clearLoginAccount(data: Partial<LoginAccount>): BaseAction {
  return {
    type: CLEAR_LOGIN_ACCOUNT,
    data
  };
}
