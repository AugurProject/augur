export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION'
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS'

export function addNotification(notification) {
  if (notification != null) {
    return {
      type: ADD_NOTIFICATION,
      data: {
        notification: {
          seen: false,
          ...notification
        }
      }
    }
  }
}

export function removeNotification(index) {
  return {
    type: REMOVE_NOTIFICATION,
    data: index
  }
}

export function updateNotification(index, notification) {
  return {
    type: UPDATE_NOTIFICATION,
    data: {
      index,
      notification
    }
  }
}

export function clearNotifications() {
  return {
    type: CLEAR_NOTIFICATIONS
  }
}
