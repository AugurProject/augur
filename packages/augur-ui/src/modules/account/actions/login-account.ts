import { LoginAccount, BaseAction } from "modules/types";

export const LOGIN_ACTIONS = {
  UPDATE_LOGIN_ACCOUNT: "UPDATE_LOGIN_ACCOUNT",
  CLEAR_LOGIN_ACCOUNT: "CLEAR_LOGIN_ACCOUNT",
};

export function updateLoginAccountAction(
  data: LoginAccount,
): BaseAction {
  return {
    type: LOGIN_ACTIONS.UPDATE_LOGIN_ACCOUNT,
    data,
  };
}

export function clearLoginAccountAction(
  data: LoginAccount,
): BaseAction {
  return {
    type: LOGIN_ACTIONS.CLEAR_LOGIN_ACCOUNT,
    data,
  };
}
