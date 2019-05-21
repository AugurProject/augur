import { Notification, BaseAction } from "src/modules/types";

export const UPDATE_READ_NOTIFICATIONS = "UPDATE_READ_NOTIFICATIONS";

export const updateReadNotifications = (notifications: Notification): BaseAction => ({
  type: UPDATE_READ_NOTIFICATIONS,
  data: { notifications }
});
