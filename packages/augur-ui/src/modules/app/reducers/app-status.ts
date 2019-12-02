import {
  IS_MOBILE,
  IS_MOBILE_SMALL,
  UPDATE_APP_STATUS,
  IS_HELP_MENU_OPEN,
  ETH_TO_DAI_RATE,
  GNOSIS_ENABLED,
  Ox_ENABLED,
  GNOSIS_STATUS,
} from 'modules/app/actions/update-app-status';
import { RESET_STATE } from 'modules/app/actions/reset-state';
import { AppStatus, BaseAction } from 'modules/types';

const DEFAULT_STATE = {
  [IS_MOBILE]: false,
  [IS_MOBILE_SMALL]: false,
  [IS_HELP_MENU_OPEN]: false,
  [ETH_TO_DAI_RATE]: null,
  [GNOSIS_ENABLED]: false,
  [GNOSIS_STATUS]: null,
  [Ox_ENABLED]: false,
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(
  appStatus = DEFAULT_STATE,
  { type, data }: BaseAction
): AppStatus {
  switch (type) {
    case UPDATE_APP_STATUS: {
      const { statusKey, value } = data;
      if (KEYS.includes(statusKey)) {
        return {
          ...appStatus,
          [statusKey]: value,
        };
      }
      return appStatus;
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return appStatus;
  }
}
