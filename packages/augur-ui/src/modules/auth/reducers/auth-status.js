import {
  IS_LOGGED,
  LEDGER_STATUS,
  EDGE_LOADING,
  EDGE_CONTEXT,
  UPDATE_AUTH_STATUS,
  IS_CONNECTION_TRAY_OPEN
} from "modules/auth/actions/update-auth-status";
import { NOT_CONNECTED } from "modules/common-elements/constants";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {
  [IS_LOGGED]: false,
  [LEDGER_STATUS]: NOT_CONNECTED,
  [EDGE_CONTEXT]: null,
  [EDGE_LOADING]: false,
  [IS_CONNECTION_TRAY_OPEN]: false
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(authStatus = DEFAULT_STATE, { type, data }) {
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
