import store from "src/store";
import * as notificationLevels from "modules/notifications/constants";
import setNotificationText from "modules/notifications/actions/set-notification-text";

export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";
export const CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS";

export function addCriticalNotification(notification) {
  return addNotification({
    level: notificationLevels.CRITICAL,
    ...notification
  });
}

export function addNotification(notification) {
  if (notification != null) {
    const callback = notification => {
      const fullNotification = {
        type: ADD_NOTIFICATION,
        data: {
          notification: {
            seen: false,
            level: notificationLevels.INFO,
            ...notification
          }
        }
      };
      return fullNotification;
    };

    return setNotificationText(notification, callback);
  }
}

export function removeNotification(id) {
  return {
    type: REMOVE_NOTIFICATION,
    data: id
  };
}

export function updateNotification(id, notification) {
  const callback = notification => {
    const fullNotification = {
      type: UPDATE_NOTIFICATION,
      data: {
        id,
        notification
      }
    };
    return fullNotification;
  };

  // Set notification.params if it is not already set.
  // (This occurs the first time the notification is updated.)
  if (notification && !notification.params) {
    const { notifications } = store.getState();
    for (
      let index = Object.keys(notifications).length - 1;
      index >= 0;
      index--
    ) {
      if (notifications[index].id === notification.id) {
        notification.params = notifications[index].params;
        notification.to = notifications[index].to;
      }
    }
  }
  return setNotificationText(notification, callback);
}

// We clear by 'notification level'.
// This will not surface in the UI just yet.
export function clearNotifications(
  notificationLevel = notificationLevels.INFO
) {
  return {
    type: CLEAR_NOTIFICATIONS,
    data: {
      level: notificationLevel
    }
  };
}
