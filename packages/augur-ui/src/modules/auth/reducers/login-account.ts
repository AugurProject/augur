import { RESET_STATE } from "modules/app/actions/reset-state";
import { LOGIN_ACTIONS, LoginAccount, LoginAccountAction } from "modules/common/types/login-account";

const DEFAULT_STATE: LoginAccount = { eth: undefined, rep: undefined, dai: undefined };

export default function(
  loginAccount: LoginAccount = DEFAULT_STATE,
  action: LoginAccountAction,
) {
  switch (action.type) {
    case LOGIN_ACTIONS.UPDATE_LOGIN_ACCOUNT:
      return {
        ...loginAccount,
        ...(action.data || {}),
      };
    case RESET_STATE:
    case LOGIN_ACTIONS.CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return loginAccount;
  }
}
