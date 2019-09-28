import {
  UPDATE_READ_NOTIFICATIONS,
  UpdateReadNotificationsAction,
} from "modules/notifications/actions/update-notifications";
import { CLEAR_LOGIN_ACCOUNT, ClearLoginAccountAction } from "modules/account/actions/login-account";
import { RESET_STATE, ResetStateAction } from "modules/app/actions/reset-state";
import { Notification } from "modules/types";

const DEFAULT_STATE: Notification[] = [];

export default (
  notifications = DEFAULT_STATE,
  action:
    | UpdateReadNotificationsAction
    | ResetStateAction
    | ClearLoginAccountAction
): Notification[] => {
  switch (action.type) {
    case UPDATE_READ_NOTIFICATIONS: {
      const ids = action.data.notifications.map(n => n.id);
      const filtered = notifications.filter(n => !ids.includes(n.id))
      return [...filtered, ...action.data.notifications];
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return notifications;
  }
};
