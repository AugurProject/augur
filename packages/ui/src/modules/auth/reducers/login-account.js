import {
  UPDATE_LOGIN_ACCOUNT,
  CLEAR_LOGIN_ACCOUNT
} from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(loginAccount = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_LOGIN_ACCOUNT:
      return {
        ...loginAccount,
        ...(data.loginAccount || {})
      };
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return loginAccount;
  }
}
