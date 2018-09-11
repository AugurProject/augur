import {
  IS_LOGGED,
  LEDGER_STATUS,
  EDGE_LOADING,
  EDGE_CONTEXT,
  UPDATE_AUTH_STATUS
} from "modules/auth/actions/update-auth-status";
import { NOT_CONNECTED } from "modules/auth/constants/ledger-status";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {
  [IS_LOGGED]: false,
  [LEDGER_STATUS]: NOT_CONNECTED,
  [EDGE_CONTEXT]: null,
  [EDGE_LOADING]: false
};

const keys = Object.keys(DEFAULT_STATE);

export default function(authStatus = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_AUTH_STATUS: {
      if (keys.includes(action.data.statusKey))
        return {
          ...authStatus,
          [action.data.statusKey]: action.data.value
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
