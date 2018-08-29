import { pull } from 'lodash'
import { RESET_STATE } from '../app/actions/reset-state'
import { INFO_NOTIFICATION, ERROR_NOTIFICATION } from '../../utils/constants'
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../app/actions/notifications'

const DEFAULT_STATE = {
  INFO_NOTIFICATION: [],
  ERROR_NOTIFICATION: []
}

export default function (notifications = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      notifications[action.data.type] = [
        ...notifications[action.data.type],
        action.data.message
      ]
      return {
        ...notifications
      }
    case REMOVE_NOTIFICATION:
      const infos = pull(notifications[INFO_NOTIFICATION], action.data.message)
      const errors = pull(notifications[ERROR_NOTIFICATION], action.data.message)
      return {
        INFO_NOTIFICATION: infos,
        ERROR_NOTIFICATION: errors
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return notifications
  }
}
