const {ipcRenderer, shell} = require('electron')
import { STOP_UI_SERVER, STOP_GETH, START_GETH, REQUEST_CONFIG, RESET_DATABASE, START_UI_SERVER, STOP_AUGUR_NODE, START_AUGUR_NODE, SAVE_CONFIG } from '../../../utils/constants'
import { updateServerAttrib } from './serverStatus'
import store from '../../store'

export const requestServerConfigurations = () => {
  ipcRenderer.send(REQUEST_CONFIG)
}

export const resetDatabase = (data) => {
  ipcRenderer.send(RESET_DATABASE, data)
}

export const startUiServer = () => {
  const config = store.getState().configuration
  ipcRenderer.send(START_UI_SERVER, config)
}

export const stoptUiServer = () => {
  ipcRenderer.send(STOP_UI_SERVER)
}

export const startAugurNode = () => {
  store.dispatch(updateServerAttrib({ CONNECTING: true }))
  const { networks } = store.getState().configuration
  const selected = Object.values(networks).find(n => n.selected)
  ipcRenderer.send(START_AUGUR_NODE, selected)
  startUiServer()
}

export const stopAugurNode = () => {
  ipcRenderer.send(STOP_AUGUR_NODE)
  stoptUiServer() // stop when disconnected from augur node
}

export const startGethNode = () => {
  store.dispatch(updateServerAttrib({ CONNECTING: true }))
  ipcRenderer.send(START_GETH)
}

export const stopGethNode = () => {
  setTimeout(() => {
    ipcRenderer.send(STOP_GETH)
  }, 1000)
}

export const saveConfiguration = (config) => {
  startUiServer() // start UI server ssl setting might have changed
  ipcRenderer.send(SAVE_CONFIG, config)
}

export const openAugurUi = (networkConfig) => {
  const { sslEnabled, sslPort, uiPort } = store.getState().configuration
  const protocol = sslEnabled ? 'https' : 'http'
  const port = sslEnabled ? sslPort : uiPort
  const wssProtocol = 'ws://127.0.0.1:9001'
  const queryString = `augur_node=${encodeURIComponent(wssProtocol)}&ethereum_node_http=${encodeURIComponent(networkConfig.http)}&ethereum_node_ws=${encodeURIComponent(networkConfig.ws)}`
  shell.openExternal(`${protocol}://127.0.0.1:${port}/#/categories?${queryString}`)
}
