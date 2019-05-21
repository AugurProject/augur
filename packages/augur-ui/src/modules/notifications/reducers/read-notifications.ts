import { UPDATE_READ_NOTIFICATIONS } from "modules/notifications/actions/update-notifications";
import { CLEAR_LOGIN_ACCOUNT } from "modules/account/actions/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { Notification, BaseAction } from "src/modules/types";

const DEFAULT_STATE: Array<Notification> = [];

export default (notifications = DEFAULT_STATE, action: BaseAction) => {
  switch (action.type) {
    case UPDATE_READ_NOTIFICATIONS:
      return action.data.notifications;

    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return notifications;
  }
};
