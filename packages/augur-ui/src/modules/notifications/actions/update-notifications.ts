import { Notification } from 'modules/types';

export const UPDATE_READ_NOTIFICATIONS = 'UPDATE_READ_NOTIFICATIONS';
export const UPDATE_CHECKBOX_ON_NOTIFICATION =
  'UPDATE_CHECKBOX_ON_NOTIFICATION';

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

export interface UpdateCheckboxOnNotificationAction {
  type: typeof UPDATE_CHECKBOX_ON_NOTIFICATION;
  data: { marketId: string; type: string; isChecked: boolean };
}

export const updateCheckboxOnNotification = (
  marketId: string,
  type: string,
  isChecked: boolean
) => ({
  type: UPDATE_CHECKBOX_ON_NOTIFICATION,
  data: { marketId, type, isChecked },
});
