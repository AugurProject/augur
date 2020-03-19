import {
  UPDATE_READ_NOTIFICATIONS,
  UpdateReadNotificationsAction,
  UPDATE_CHECKBOX_ON_NOTIFICATION,
  UpdateCheckboxOnNotificationAction,
} from 'modules/notifications/actions/update-notifications';
import {
  CLEAR_LOGIN_ACCOUNT,
  ClearLoginAccountAction,
} from 'modules/account/actions/login-account';
import { RESET_STATE, ResetStateAction } from 'modules/app/actions/reset-state';
import { Notification } from 'modules/types';

const DEFAULT_STATE: Notification[] = [];

export default (
  notifications = DEFAULT_STATE,
  action:
    | UpdateReadNotificationsAction
    | ResetStateAction
    | ClearLoginAccountAction
    | UpdateCheckboxOnNotificationAction
): Notification[] => {
  switch (action.type) {
    case UPDATE_READ_NOTIFICATIONS: {
      const ids = action.data.notifications.map(n => n.id);
      let filtered = notifications.filter(n => !ids.includes(n.id));
      let notificationsUpdated = action.data.notifications;
      notificationsUpdated.forEach(notification => {
        if (notification.isChecked) {
          notification.hideNotification = true;
        }
        return notification;
      })
      return [...filtered, ...notificationsUpdated];
    }
    case UPDATE_CHECKBOX_ON_NOTIFICATION: {
      const { marketId, type, isChecked } = action.data;
      let updateNotifications = notifications;
      updateNotifications.forEach(notification => {
        if (
          notification.type === type &&
          notification.market &&
          notification.market.id === marketId
        ) {
          notification.isChecked = isChecked;
          return notification;
        }
        return notification;
      });
      return [...updateNotifications];
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return notifications;
  }
};
