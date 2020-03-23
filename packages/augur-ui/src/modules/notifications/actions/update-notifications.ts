import { Notification } from 'modules/types';

export const UPDATE_READ_NOTIFICATIONS = 'UPDATE_READ_NOTIFICATIONS';

export interface UpdateReadNotificationsAction {
  type: typeof UPDATE_READ_NOTIFICATIONS;
  data: { notifications: Notification[] };
}

export const updateReadNotifications = (
  notifications: Notification[]
): UpdateReadNotificationsAction => ({
  type: UPDATE_READ_NOTIFICATIONS,
  data: { notifications },
});
