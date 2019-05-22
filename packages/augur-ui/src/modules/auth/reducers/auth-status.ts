import {
  IS_LOGGED,
  EDGE_CONTEXT,
  EDGE_LOADING,
  IS_CONNECTION_TRAY_OPEN,
  UPDATE_AUTH_STATUS
} from "modules/auth/actions/auth-status";
import { AppStatus, BaseAction } from "modules/types";
import { CLEAR_LOGIN_ACCOUNT } from "modules/account/actions/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE: AppStatus = {
  [IS_LOGGED]: false,
  [EDGE_CONTEXT]: undefined,
  [EDGE_LOADING]: false,
  [IS_CONNECTION_TRAY_OPEN]: false
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(
  authStatus: AppStatus = DEFAULT_STATE,
  { type, data }: BaseAction
) {
  switch (type) {
    case UPDATE_AUTH_STATUS: {
      const { statusKey, value } = data;
      if (KEYS.includes(statusKey))
        return {
          ...authStatus,
          [statusKey]: value
        };
      return authStatus;
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return authStatus;
  }
}
