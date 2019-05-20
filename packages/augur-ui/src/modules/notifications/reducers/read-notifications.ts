import { UPDATE_READ_NOTIFICATIONS } from "modules/notifications/actions/update-notifications";
import { LOGIN_ACTIONS } from "modules/common/types/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { INotifications } from "modules/account/components/notifications";

const DEFAULT_STATE: Array<null> = [];

export interface Data {
  notifications: Array<INotifications>;
}

export interface Action {
  type: string;
  data: Data;
}

export default (notifications = DEFAULT_STATE, action: Action) => {
  switch (action.type) {
    case UPDATE_READ_NOTIFICATIONS:
      return action.data.notifications;

    case RESET_STATE:
    case LOGIN_ACTIONS.CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return notifications;
  }
};
