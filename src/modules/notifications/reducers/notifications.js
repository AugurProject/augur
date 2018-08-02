import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from 'modules/notifications/actions'
import { RESET_STATE } from 'modules/app/actions/reset-state'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

const DEFAULT_STATE = []

/**
 * @typedef {Object} NotificationAction
 * @property {string} text - String to show as a call to action.
 * @property {function} actionFn - Called when the user clicks the notification.
 *
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - unique identifier
 * @property {string} title - action that occurred, truncated in UI
 * @property {string} description - additional details, truncated in UI
 * @property {Object} timestamp - UTC epoch
 * @property {enum} level - notification level
 * @property {string} [href] - link to more context
 * @property {NotificationAction} [action] - Config for notification bar. Note: This is mutually exclusive with 'href'.
 *
 */

/**
 * @param {Notification[]} notifications
 * @param {Object} action
 * @param {Notification} action.data
 * @param {string} action.type
 * @returns {Notification[]}
 *
 */
export default function (notifications = DEFAULT_STATE, { data, type }) {
  switch (type) {
    case ADD_NOTIFICATION: {
      const isDuplicate = notifications.findIndex(notification => notification.id === data.notification.id && notification.title === data.notification.title) !== -1

      if (isDuplicate) return notifications

      return [
        ...notifications,
        data.notification,
      ]
    }
    case REMOVE_NOTIFICATION:
      return notifications.filter((notification, i) => notification.id !== data)
    case UPDATE_NOTIFICATION:
      return notifications.map((notification, i) => {
        if (notification.id !== data.id) {
          return notification
        }
        if (notification.status !== data.notification.status) {
          data.notification.seen = data.notification.seen || false
        }
        return {
          ...notification,
          ...data.notification,
        }
      })

    case CLEAR_NOTIFICATIONS:
      return notifications.filter(it => it.level !== data.level)

    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return notifications
  }
}
