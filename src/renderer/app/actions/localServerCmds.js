const {ipcRenderer} = require('electron')
import { STOP_GETH, START_GETH, REQUEST_CONFIG, REQUEST_LATEST_SYNCED_BLOCK, RESET_DATABASE, START_UI_SERVER, STOP_AUGUR_NODE, START_AUGUR_NODE, SAVE_CONFIG } from '../../../utils/constants'

export const requestServerConfigurations = () => {
  ipcRenderer.send(REQUEST_CONFIG)
}

export const requestLatestSyncedBlock = () => {
  ipcRenderer.send(REQUEST_LATEST_SYNCED_BLOCK)
}

export const resetDatabase = (data) => {
  ipcRenderer.send(RESET_DATABASE, data)
}

export const startUiServer = (data) => {
  ipcRenderer.send(START_UI_SERVER, data)
}

export const startAugurNode = (connection) => {
  ipcRenderer.send(START_AUGUR_NODE, connection)
}

export const stopAugurNode = () => {
  ipcRenderer.send(STOP_AUGUR_NODE)
}

export const startGethNode = () => {
  ipcRenderer.send(START_GETH)
}

export const stopGethNode = () => {
  ipcRenderer.send(STOP_GETH)
}

export const saveConfiguration = (config) => {
  ipcRenderer.send(SAVE_CONFIG, config)
}
