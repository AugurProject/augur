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
  (dispatch, getState) => {
    dispatch({
      type: UPDATE_CONFIG,
      config
    }, () => {
      const config = getState().configuration
      saveConfiguration(config)
    })
  }

}

export function updateConnection(oldConn, newConn) {
  (dispatch, getState) => {
    dispatch({
      type: REMOVE_CONNECTION,
      oldConn
    }, () => {
      dispatch({
        type: ADD_CONNECTION,
        newConn
      }, () => {
        const config = getState().configuration
        saveConfiguration(config)
      })
    })

  }
}

export function addConnection(connection) {
  (dispatch, getState) => {
    dispatch({
      type: ADD_CONNECTION,
      connection
    }, () => {
      const config = getState().configuration
      saveConfiguration(config)
    })
  }

}

export function removeConnection(connection) {
  (dispatch, getState) => {
    dispatch({
      type: REMOVE_CONNECTION,
      connection
    }, () => {
      const config = getState().configuration
      saveConfiguration(config)
    })
  }

}
