const {ipcRenderer} = require('electron')
import { BULK_SYNC_FINISHED, BULK_SYNC_STARTED, ERROR_NOTIFICATION, INFO_NOTIFICATION, ON_UI_SERVER_CONNECTED, ON_UI_SERVER_DISCONNECTED, REQUEST_CONFIG_RESPONSE, LATEST_SYNCED_BLOCK, LATEST_SYNCED_GETH_BLOCK, ON_SERVER_CONNECTED, ON_SERVER_DISCONNECTED, PEER_COUNT_DATA, GETH_FINISHED_SYNCING } from '../utils/constants'
import { initializeConfiguration } from './app/actions/configuration'
import { updateBlockInfo } from './app/actions/blockInfo'
import { updateServerAttrib } from './app/actions/serverStatus'
import { addInfoNotification, addErrorNotification } from './app/actions/notifications'
import { startAugurNode } from './app/actions/localServerCmds'
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
    store.dispatch(updateBlockInfo({}))
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

    // go ahead and start augur node
    startAugurNode()
  })

  ipcRenderer.on(BULK_SYNC_STARTED, () => {
    store.dispatch(updateServerAttrib({ AUGUR_BULK_SYNCING: true }))
  })

  ipcRenderer.on(BULK_SYNC_FINISHED, () => {
    store.dispatch(updateServerAttrib({ AUGUR_BULK_SYNCING: false }))
  })

  ipcRenderer.on(INFO_NOTIFICATION, (event, notification) => {
    notification.timestamp = new Date().getTime()
    setTimeout(() => {
      store.dispatch(addInfoNotification(notification))
    }, 300)
  })

  ipcRenderer.on(ERROR_NOTIFICATION, (event, notification) => {
    notification.timestamp = new Date().getTime()
    store.dispatch(addErrorNotification(notification))
  })

}
