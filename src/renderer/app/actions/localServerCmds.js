const {ipcRenderer} = require('electron')
import { REQUEST_NETWORK_CONFIG, REQUEST_PORTS_CONFIG, REQUEST_LATEST_SYNCED_BLOCK, RESET, TOGGLE_SSL_RESET, START_UI_SERVER, STOP, START, REBUILD_MENU, SAVE_NETWORK_CONFIG, TOGGLE_GETH } from '../../../utils/constants'

export const requestServerConfigurations = () => {
  ipcRenderer.send(REQUEST_NETWORK_CONFIG)
  ipcRenderer.send(REQUEST_PORTS_CONFIG)
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

export const start = (connection) => {
  ipcRenderer.send(START, connection)
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
