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
          ...notification,
        },
      },
    }
  }
}

export function removeNotification(id) {
  return {
    type: REMOVE_NOTIFICATION,
    data: id,
  }
}

export function updateNotification(id, notification) {
  return {
    type: UPDATE_NOTIFICATION,
    data: {
      id,
      notification,
    },
  }
}

export function clearNotifications() {
  return {
    type: CLEAR_NOTIFICATIONS,
  }
}
