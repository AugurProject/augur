import { INotifications } from "modules/account/components/notifications/notifications";

export const UPDATE_READ_NOTIFICATIONS = "UPDATE_READ_NOTIFICATIONS";

export const updateReadNotifications = (notifications: INotifications) => ({
  type: UPDATE_READ_NOTIFICATIONS,
  data: { notifications }
});
