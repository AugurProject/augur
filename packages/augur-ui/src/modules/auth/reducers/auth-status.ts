import {
  IS_LOGGED,
  IS_CONNECTION_TRAY_OPEN,
  UPDATE_AUTH_STATUS,
  RESTORED_ACCOUNT,
} from 'modules/auth/actions/auth-status';
import { AuthStatus, BaseAction } from 'modules/types';
import { CLEAR_LOGIN_ACCOUNT } from 'modules/account/actions/login-account';
import { RESET_STATE } from 'modules/app/actions/reset-state';

const DEFAULT_STATE: AuthStatus = {
  [IS_LOGGED]: false,
  [RESTORED_ACCOUNT]: false,
  [IS_CONNECTION_TRAY_OPEN]: false,
}

const KEYS = Object.keys(DEFAULT_STATE);

export default function(
  authStatus: AuthStatus = DEFAULT_STATE,
  { type, data }: BaseAction
): AuthStatus {
  switch (type) {
    case UPDATE_AUTH_STATUS: {
      const { statusKey, value } = data;
      if (KEYS.includes(statusKey)) {
        return {
          ...authStatus,
          [statusKey]: value,
        };
      }
      return authStatus;
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return authStatus;
  }
}
