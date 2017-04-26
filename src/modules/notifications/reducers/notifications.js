import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from 'modules/notifications/actions/update-notifications';

const DEFAULT_STATE = [];

export default function (notifications = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [
        ...notifications,
        action.data.notification
      ];
    case REMOVE_NOTIFICATION: {
      return notifications.filter((notification, i) => i !== action.data.index);
    }
    case UPDATE_NOTIFICATION: {
      return notifications.map((notification, i) => {
        if (i !== action.data.index) {
          return notification;
        }

        return {
          ...notification,
          ...action.data.notification
        };
      });
    }
    case CLEAR_NOTIFICATIONS:
      return DEFAULT_STATE;
    default:
      return notifications;
  }
}
