const {ipcRenderer} = require('electron')
import { ERROR_NOTIFICATION, INFO_NOTIFICATION, ON_UI_SERVER_CONNECTED, ON_UI_SERVER_DISCONNECTED, REQUEST_CONFIG_RESPONSE, LATEST_SYNCED_BLOCK, LATEST_SYNCED_GETH_BLOCK, ON_SERVER_CONNECTED, ON_SERVER_DISCONNECTED, PEER_COUNT_DATA, GETH_FINISHED_SYNCING } from '../utils/constants'
import { initializeConfiguration } from './app/actions/configuration'
import { updateBlockInfo } from './app/actions/blockInfo'
import { updateServerAttrib } from './app/actions/serverStatus'
import { addInfoNotification, addErrorNotification } from './app/actions/notifications'
import store from './store'

export const handleEvents = () => {

  ipcRenderer.on('ready', () => {
    console.log('app is ready')
  })

  ipcRenderer.on(REQUEST_CONFIG_RESPONSE, (event, config) => {
    store.dispatch(initializeConfiguration(config))
  })

  ipcRenderer.on(LATEST_SYNCED_BLOCK, (event, info) => {
    store.dispatch(updateBlockInfo(info))
  })

  ipcRenderer.on(LATEST_SYNCED_GETH_BLOCK, (event, info) => {
    store.dispatch(updateBlockInfo(info))
  })

  ipcRenderer.on(ON_SERVER_CONNECTED, () => {
    store.dispatch(updateServerAttrib({ CONNECTED: true }))
  })

  ipcRenderer.on(ON_SERVER_DISCONNECTED, () => {
    store.dispatch(updateServerAttrib({ CONNECTED: false }))
  })

  ipcRenderer.on(ON_UI_SERVER_CONNECTED, () => {
    store.dispatch(updateServerAttrib({ UI_SERVER_CONNECTED: true }))
  })

  ipcRenderer.on(ON_UI_SERVER_DISCONNECTED, () => {
    store.dispatch(updateServerAttrib({ UI_SERVER_DISCONNECTED: false }))
  })

  ipcRenderer.on(PEER_COUNT_DATA, (event, data) => {
    store.dispatch(updateServerAttrib({ PEER_COUNT_DATA: data.peerCount }))
  })

  ipcRenderer.on(GETH_FINISHED_SYNCING, () => {
    store.dispatch(updateServerAttrib({ GETH_FINISHED_SYNCING: true }))
  })

  ipcRenderer.on(INFO_NOTIFICATION, (notification) => {
    store.dispatch(addInfoNotification(notification))
  })

  ipcRenderer.on(ERROR_NOTIFICATION, (notification) => {
    store.dispatch(addErrorNotification(notification))
  })

}
