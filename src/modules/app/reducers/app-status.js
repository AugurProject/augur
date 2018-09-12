import {
  IS_ANIMATING,
  IS_MOBILE,
  IS_MOBILE_SMALL,
  HAS_LOADED_MARKETS,
  TRANSACTIONS_LOADING,
  UPDATE_APP_STATUS
} from "modules/app/actions/update-app-status";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {
  [IS_ANIMATING]: false,
  [IS_MOBILE]: false,
  [IS_MOBILE_SMALL]: false,
  [HAS_LOADED_MARKETS]: false,
  [TRANSACTIONS_LOADING]: false
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(appStatus = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_APP_STATUS: {
      if (KEYS.includes(action.data.statusKey))
        return {
          ...appStatus,
          [action.data.statusKey]: action.data.value
        };
      return appStatus;
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return appStatus;
  }
}
