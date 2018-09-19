import { pull, take, orderBy } from 'lodash'
import { RESET_STATE } from '../app/actions/reset-state'
import { INFO_NOTIFICATION, ERROR_NOTIFICATION } from '../../utils/constants'
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../app/actions/notifications'

const DEFAULT_STATE = {
  INFO_NOTIFICATION: [],
  ERROR_NOTIFICATION: []
}

const MAX_NOTIFICATIONS = 5

export default function (notifications = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      notifications[action.data.type] = [
        ...notifications[action.data.type],
        action.data.message
      ]
      return {
        INFO_NOTIFICATION: take(orderBy(notifications[INFO_NOTIFICATION], ['timestamp'], ['desc']), MAX_NOTIFICATIONS),
        ERROR_NOTIFICATION: take(orderBy(notifications[ERROR_NOTIFICATION], ['timestamp'], ['desc']), MAX_NOTIFICATIONS)
      }
    case REMOVE_NOTIFICATION:
      return {
        INFO_NOTIFICATION: pull(notifications[INFO_NOTIFICATION], action.data.message),
        ERROR_NOTIFICATION: pull(notifications[ERROR_NOTIFICATION], action.data.message)
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return notifications
  }
}
