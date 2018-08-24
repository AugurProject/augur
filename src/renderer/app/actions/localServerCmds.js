const {ipcRenderer} = require('electron')
import { REQUEST_CONFIG, REQUEST_LATEST_SYNCED_BLOCK, RESET, TOGGLE_SSL_RESET, START_UI_SERVER, STOP, START, REBUILD_MENU, SAVE_NETWORK_CONFIG, TOGGLE_GETH } from '../../../utils/events'

export const requestConnectionConfigurations = () => {
  ipcRenderer.send(REQUEST_CONFIG)
}

export const requestLatestSyncedBlock = () => {
  ipcRenderer.send(REQUEST_LATEST_SYNCED_BLOCK)
}

export const reset = (data) => {
  ipcRenderer.send(RESET, data)
}

export const toggleSslAndRestart = (data) => {
  ipcRenderer.send(TOGGLE_SSL_RESET, data)
}

export const startUiServer = (data) => {
  ipcRenderer.send(START_UI_SERVER, data)
}

export const start = (data) => {
  ipcRenderer.send(START, data)
}

export const stop = () => {
  ipcRenderer.send(STOP)
}

export const rebuildMenu = (data) => {
  ipcRenderer.send(REBUILD_MENU, data)
}

export const saveNetworkConfig = (data) => {
  ipcRenderer.send(SAVE_NETWORK_CONFIG, data)
}

export const toggleGeth = () => {
  ipcRenderer.send(TOGGLE_GETH)
}
