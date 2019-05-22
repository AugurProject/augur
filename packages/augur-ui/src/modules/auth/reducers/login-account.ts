import { RESET_STATE } from "modules/app/actions/reset-state";
import {
  UPDATE_LOGIN_ACCOUNT,
  CLEAR_LOGIN_ACCOUNT
} from "modules/account/actions/login-account";
import { LoginAccount, BaseAction } from "modules/types";

const DEFAULT_STATE: LoginAccount = {
  eth: undefined,
  rep: undefined,
  dai: undefined
};

export default function(
  loginAccount: LoginAccount = DEFAULT_STATE,
  { type, data }: BaseAction
) {
  switch (type) {
    case UPDATE_LOGIN_ACCOUNT:
      return {
        ...loginAccount,
        ...(data || {})
      };
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return loginAccount;
  }
}
