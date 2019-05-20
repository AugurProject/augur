import {
  IS_MOBILE,
  IS_MOBILE_SMALL,
  UPDATE_APP_STATUS
} from "modules/app/actions/update-app-status";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {
  [IS_MOBILE]: false,
  [IS_MOBILE_SMALL]: false
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(appStatus = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_APP_STATUS: {
      const { statusKey, value } = data;
      if (KEYS.includes(statusKey))
        return {
          ...appStatus,
          [statusKey]: value
        };
      return appStatus;
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return appStatus;
  }
}
