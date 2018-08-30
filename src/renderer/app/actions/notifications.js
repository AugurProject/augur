import { INFO_NOTIFICATION, ERROR_NOTIFICATION } from '../../../utils/constants'
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

export function addInfoNotification(message) {
  return {
    type: ADD_NOTIFICATION,
    data: { message, type: INFO_NOTIFICATION, timestamp: new Date().getTime() }
  }
}

export function addErrorNotification(message) {
  return {
    type: ADD_NOTIFICATION,
    data: { message, type: ERROR_NOTIFICATION, timestamp: new Date().getTime() }
  }
}

export function removeNotification(message) {
  return {
    type: REMOVE_NOTIFICATION,
    data: { message }
  }
}
