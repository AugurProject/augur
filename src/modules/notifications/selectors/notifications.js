import { createSelector } from "reselect";
import { selectNotificationsState } from "src/select-state";

import * as notificationLevels from "src/modules/notifications/constants";

import getValue from "utils/get-value";

export const selectNotificationsByLevel = level => state =>
  selectNotificationsState(state).filter(it => it.level === level);

export const selectCriticalNotifications = selectNotificationsByLevel(
  notificationLevels.CRITICAL
);
export const selectInfoNotifications = selectNotificationsByLevel(
  notificationLevels.INFO
);

export const selectInfoNotificationsAndSeenCount = createSelector(
  selectInfoNotifications,
  notifications => {
    const sortedNotifications = notifications
      .map((notification, i) => ({
        ...notification,
        index: i
      }))
      .sort((a, b) => getValue(b, "timestamp") - getValue(a, "timestamp"));

    const unseenCount = sortedNotifications.reduce((p, notification) => {
      if (!notification.seen) return 1 + p;
      return p;
    }, 0);

    return {
      unseenCount,
      notifications: sortedNotifications
    };
  }
);
