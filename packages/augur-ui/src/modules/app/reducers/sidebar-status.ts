import {
  UPDATE_CURRENT_BASE_PATH,
  UPDATE_CURRENT_INNER_NAV_TYPE,
  UPDATE_MOBILE_MENU_STATE,
  UPDATE_SIDEBAR_STATUS,
  UPDATE_IS_ALERT_VISIBLE
} from "modules/app/actions/update-sidebar-status";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { MOBILE_MENU_STATES } from "modules/common-elements/constants";
import { MARKETS } from "modules/routes/constants/views";
import { BaseAction } from "src/modules/types";

const DEFAULT_STATE = {
  mobileMenuState: MOBILE_MENU_STATES.CLOSED,
  currentBasePath: MARKETS,
  currentInnerNavType: null,
  isAlertsVisible: false,
};

export default function(sideNavStatus = DEFAULT_STATE, action: BaseAction) {
  switch (action.type) {
    case UPDATE_CURRENT_BASE_PATH: {
      return { ...sideNavStatus, currentBasePath: action.data };
    }
    case UPDATE_MOBILE_MENU_STATE: {
      return { ...sideNavStatus, mobileMenuState: action.data };
    }
    case UPDATE_CURRENT_INNER_NAV_TYPE: {
      return {
        ...sideNavStatus,
        currentInnerNavType: action.data,
      };
    }
    case UPDATE_IS_ALERT_VISIBLE: {
      return { ...sideNavStatus, isAlertsVisible: action.data };
    }
    case UPDATE_SIDEBAR_STATUS: {
      return {
        ...sideNavStatus,
        ...action.data,
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return sideNavStatus;
  }
}
