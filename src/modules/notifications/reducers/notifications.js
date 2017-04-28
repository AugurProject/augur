import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from 'modules/notifications/actions/update-notifications';

const DEFAULT_STATE = [];

// NOTE -- a well formed notification should have the following properties:
// {any} id - unique identifier
// {string} title - action that occurred, truncated in UI
// {string} description - additional details, truncated in UI
// {object} timestamp - UTC epoch
// {func} onClick - formatted via link selector, where a user can view additional information
// {bool} seen - has the user seen this notification already

export default function (notifications = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_NOTIFICATION: {
      console.log('ADD_NOTIFICATION -- ', action);
      return [
        ...notifications,
        {
          seen: false,
          ...action.data.notification
        }
      ];
    }
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
