import { AUTH_STATUS } from "modules/auth/actions/auth-status";
import { AppStatus, BaseAction } from "modules/types";
import { LOGIN_ACTIONS } from "modules/account/actions/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE: AppStatus = {
  [AUTH_STATUS.IS_LOGGED]: false,
  [AUTH_STATUS.EDGE_CONTEXT]: undefined,
  [AUTH_STATUS.EDGE_LOADING]: false,
  [AUTH_STATUS.IS_CONNECTION_TRAY_OPEN]: false,
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(
  authStatus: AppStatus = DEFAULT_STATE,
  action: BaseAction,
) {
  switch (action.type) {
    case AUTH_STATUS.UPDATE_AUTH_STATUS: {
      const { statusKey, value } = action.data;
      if (KEYS.includes(statusKey))
        return {
          ...authStatus,
          [statusKey]: value,
        };
      return authStatus;
    }
    case RESET_STATE:
    case LOGIN_ACTIONS.CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return authStatus;
  }
}
