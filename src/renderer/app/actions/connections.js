export const ADD_UPDATE_CONNECTION = 'ADD_CONNECTION'
export const REMOVE_CONNECTION = 'REMOVE_CONNECTION'
export const CLEAR_CONNECTIONS = 'CLEAR_CONNECTIONS'

export function addUpdateConnection(connection) {
  return {
    type: ADD_UPDATE_CONNECTION,
    connection
  }
}

export function removeConnection(connection) {
  return {
    type: REMOVE_CONNECTION,
    connection
  }
}
