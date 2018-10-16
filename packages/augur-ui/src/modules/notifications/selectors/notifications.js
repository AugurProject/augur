import { createSelector } from "reselect";

import { selectNotificationsState } from "src/select-state";
import store from "src/store";

import * as notificationLevels from "modules/notifications/constants/notifications";

import { augur } from "services/augurjs";
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
    const networkId = augur.rpc.getNetworkID();
    const { universe } = store.getState();

    let filteredNotifications = notifications;
    if (networkId && universe) {
      // Filter out notifications from other networks/universes
      filteredNotifications = notifications
        .filter(
          notification =>
            (notification.networkId === networkId.toString() &&
              notification.universe === universe.id) ||
            typeof notification.networkId === "undefined" ||
            typeof notification.universe === "undefined"
        )
        .reverse();
    }
    const sortedNotifications = filteredNotifications
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
