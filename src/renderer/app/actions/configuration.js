import { saveConfiguration } from './localServerCmds'
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
  (dispatch) => {
    dispatch({
      type: UPDATE_CONFIG,
      config
    }, () => {
      dispatch(saveConfiguration())
    })
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
      }, () => {
        dispatch(saveConfiguration())
      })
    })

  }
}

export function addConnection(connection) {
  (dispatch) => {
    dispatch({
      type: ADD_CONNECTION,
      connection
    }, () => {
      dispatch(saveConfiguration())
    })
  }

}

export function removeConnection(connection) {
  (dispatch) => {
    dispatch({
      type: REMOVE_CONNECTION,
      connection
    }, () => {
      dispatch(saveConfiguration())
    })
  }

}
