export const ADD_UPDATE_CONNECTION = 'ADD_CONNECTION'
export const REMOVE_CONNECTION = 'REMOVE_CONNECTION'

export function addUpdateConnection() {
  return {
    type: ADD_UPDATE_CONNECTION
  }
}

export function removeConnection() {
  return {
    type: REMOVE_CONNECTION
  }
}
