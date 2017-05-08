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
// {string} href - link to more context
//
// The `seen` + `index` params get handled behind the scenes

export default function (notifications = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [
        ...notifications,
        action.data.notification
      ];
    case REMOVE_NOTIFICATION:
      return notifications.filter((notification, i) => i !== action.data);
    case UPDATE_NOTIFICATION:
      return notifications.map((notification, i) => {
        if (i !== action.data.index) {
          return notification;
        }

        return {
          ...notification,
          ...action.data.notification
        };
      });
    case CLEAR_NOTIFICATIONS:
      return DEFAULT_STATE;
    default:
      return notifications;
  }
}
