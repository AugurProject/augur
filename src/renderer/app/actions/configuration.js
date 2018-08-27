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
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_CONFIG,
      config
    })
    saveConfiguration(getState().configuration)
  }
}

export function updateSelectedConnection(name) {
  return (dispatch, getState) => {
    const config = getState().configuration
    const networks = config.networks.map((n) => {
      if (n.name === name) {
        n.selected = true
      } else {
        delete n.selected
      }
      return n
    })
    config.networks = networks
    dispatch({
      type: UPDATE_CONFIG,
      config
    })
    saveConfiguration(getState().configuration)
  }
}

export function updateConnection(oldConn, newConn) {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_CONNECTION,
      oldConn
    })
    dispatch({
      type: ADD_CONNECTION,
      newConn
    })
    saveConfiguration(getState().configuration)
  }
}

export function addConnection(connection) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_CONNECTION,
      connection
    })
    saveConfiguration(getState().configuration)
  }
}

export function removeConnection(connection) {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_CONNECTION,
      connection
    })
    saveConfiguration(getState().configuration)
  }
}
