export const INITIALIZE_CONFIG = 'INITIALIZE_CONFIG'
export const UPDATE_CONFIG = 'UPDATE_CONFIG'
export const ADD_CONNECTION = 'ADD_UPDATE_CONNECTION'
export const REMOVE_CONNECTION = 'REMOVE_CONNECTION'

export function initializeConfiguration(configuration) {
  return {
    type: INITIALIZE_CONFIG,
    configuration
  }
}

export function updateConfig(config) {
  return {
    type: UPDATE_CONFIG,
    config
  }
}

export function updateConnection(oldConn, newConn) {
  (dispatch) => {
    dispatch({
      type: REMOVE_CONNECTION,
      oldConn
    }, () => {
      dispatch({
        type: ADD_CONNECTION,
        newConn
      })
    })

  }
}

export function addConnection(connection) {
  return {
    type: ADD_CONNECTION,
    connection
  }
}

export function removeConnection(connection) {
  return {
    type: REMOVE_CONNECTION,
    connection
  }
}
