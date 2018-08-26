const {ipcRenderer} = require('electron')
import { REQUEST_CONFIG, REQUEST_LATEST_SYNCED_BLOCK, RESET, START_UI_SERVER, STOP, START, REBUILD_MENU, SAVE_CONFIG, TOGGLE_GETH } from '../../../utils/constants'

export const requestServerConfigurations = () => {
  ipcRenderer.send(REQUEST_CONFIG)
}

export const requestLatestSyncedBlock = () => {
  ipcRenderer.send(REQUEST_LATEST_SYNCED_BLOCK)
}

export const reset = (data) => {
  ipcRenderer.send(RESET, data)
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

export const saveConfiguration = (config) => {
  ipcRenderer.send(SAVE_CONFIG, config)
}

export const toggleGeth = () => {
  ipcRenderer.send(TOGGLE_GETH)
}
