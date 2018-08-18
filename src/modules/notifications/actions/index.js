import * as notificationLevels from "src/modules/notifications/constants";

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
    return {
      type: ADD_NOTIFICATION,
      data: {
        notification: {
          seen: false,
          level: notificationLevels.INFO,
          ...notification
        }
      }
    };
  }
}

export function removeNotification(id) {
  return {
    type: REMOVE_NOTIFICATION,
    data: id
  };
}

export function updateNotification(id, notification) {
  return {
    type: UPDATE_NOTIFICATION,
    data: {
      id,
      notification
    }
  };
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
