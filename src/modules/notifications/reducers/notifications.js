import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from 'modules/notifications/actions/update-notifications'
import { RESET_STATE } from 'modules/app/actions/reset-state'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

const DEFAULT_STATE = []

// NOTE -- a well formed notification should have the following properties:
// {any} id - unique identifier
// {string} title - action that occurred, truncated in UI
// {string} description - additional details, truncated in UI
// {object} timestamp - UTC epoch
//
// Optional Properties
//
// {string} href - link to more context
//
// The `seen` + `index` params get handled behind the scenes
export default function (notifications = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_NOTIFICATION: {
      const isDuplicate = notifications.findIndex(notification => notification.id === action.data.notification.id && notification.title === action.data.notification.title) !== -1

      if (isDuplicate) return notifications

      return [
        ...notifications,
        action.data.notification,
      ]
    }
    case REMOVE_NOTIFICATION:
      return notifications.filter((notification, i) => notification.id !== action.data)
    case UPDATE_NOTIFICATION:
      return notifications.map((notification, i) => {
        if (notification.id !== action.data.id) {
          return notification
        }

        return {
          ...notification,
          ...action.data.notification,
        }
      })
    case RESET_STATE:
    case CLEAR_NOTIFICATIONS:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return notifications
  }
}
