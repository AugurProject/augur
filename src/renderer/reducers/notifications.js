import { pull } from 'lodash'
import { RESET_STATE } from '../app/actions/reset-state'
import { INFO_NOTIFICATION, ERROR_NOTIFICATION, ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../app/actions/notifications'

const DEFAULT_STATE = {
  INFO_NOTIFICATION: [],
  ERROR_NOTIFICATION: []
}

export default function (notifications = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      notifications[action.data.type].push(action.data.message)
      return {
        ...notifications
      }
    case REMOVE_NOTIFICATION:
      pull(notifications[INFO_NOTIFICATION], message)
      pull(notifications[ERROR_NOTIFICATION], message)
      return {
        ...notifications
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return notifications
  }
}
