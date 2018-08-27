import { saveConfiguration } from './localServerCmds'
export const INITIALIZE_CONFIG = 'INITIALIZE_CONFIG'
export const UPDATE_CONFIG = 'UPDATE_CONFIG'
export const ADD_UPDATE_CONNECTION = 'ADD_UPDATE_CONNECTION'
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

export function updateSelectedConnection(selectedKey) {
  return (dispatch, getState) => {
    const config = getState().configuration
    Object.keys(config.networks).forEach(key => config.networks[key].selected = key === selectedKey ? true : false)
    dispatch({
      type: UPDATE_CONFIG,
      config
    })
    saveConfiguration(getState().configuration)
  }
}

export function addUpdateConnection(key, connection) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_UPDATE_CONNECTION,
      key,
      connection
    })
    saveConfiguration(getState().configuration)
  }
}

export function removeConnection(key) {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_CONNECTION,
      key
    })
    saveConfiguration(getState().configuration)
  }
}
