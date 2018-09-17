const {ipcRenderer} = require('electron')
import { ON_GETH_SERVER_DISCONNECTED, ON_GETH_SERVER_CONNECTED, BULK_SYNC_FINISHED, BULK_SYNC_STARTED, ERROR_NOTIFICATION, INFO_NOTIFICATION, ON_UI_SERVER_CONNECTED, ON_UI_SERVER_DISCONNECTED, REQUEST_CONFIG_RESPONSE, LATEST_SYNCED_BLOCK, LATEST_SYNCED_GETH_BLOCK, ON_SERVER_CONNECTED, ON_SERVER_DISCONNECTED, PEER_COUNT_DATA, GETH_FINISHED_SYNCING, RUNNING_FAILURE } from '../utils/constants'
import { initializeConfiguration } from './app/actions/configuration'
import { updateGethBlockInfo, clearGethBlockInfo, updateAugurNodeBlockInfo, clearAugurNodeBlockInfo } from './app/actions/blockInfo'
import { updateServerAttrib } from './app/actions/serverStatus'
import { addInfoNotification, addErrorNotification } from './app/actions/notifications'
import { startAugurNode } from './app/actions/local-server-cmds'
import store from './store'

export const handleEvents = () => {

  let stallChecker = null
  let lastSyncBlockNumber = null

  ipcRenderer.on('ready', () => {
    console.log('app is ready')
  })

  ipcRenderer.on(REQUEST_CONFIG_RESPONSE, (event, config) => {
    store.dispatch(initializeConfiguration(config))
  })

  ipcRenderer.on(LATEST_SYNCED_BLOCK, (event, info) => {
    if (info && info.lastSyncBlockNumber) {
      store.dispatch(updateServerAttrib({ AUGUR_NODE_SYNCING: true }))
    }
    store.dispatch(updateAugurNodeBlockInfo(info))
  })

  ipcRenderer.on(LATEST_SYNCED_GETH_BLOCK, (event, info) => {
    store.dispatch(updateGethBlockInfo(info))
  })

  ipcRenderer.on(ON_SERVER_CONNECTED, () => {
    store.dispatch(updateServerAttrib({ AUGUR_NODE_CONNECTED: true, CONNECTING: false }))

    // check to see augur node hasn't stalled out

    stallChecker = setInterval(() => {
      const newLastSyncBlockNumber = store.getState().augurNodeBlockInfo.lastSyncBlockNumber
      if (lastSyncBlockNumber === newLastSyncBlockNumber) {
        store.dispatch(addErrorNotification({
          messageType: RUNNING_FAILURE,
          message: 'Syncing may have stalled, try disconnecting and reconnecting'
        }))
      }
      lastSyncBlockNumber = newLastSyncBlockNumber
    }, 10 * 60 * 1000) // 10 minutes
  })

  ipcRenderer.on(ON_SERVER_DISCONNECTED, () => {
    store.dispatch(updateServerAttrib({ AUGUR_NODE_CONNECTED: false, CONNECTING: false, AUGUR_NODE_SYNCING: false }))
    // clear block info
    store.dispatch(clearAugurNodeBlockInfo())
    clearInterval(stallChecker)
  })

  ipcRenderer.on(ON_GETH_SERVER_CONNECTED, () => {
    store.dispatch(updateServerAttrib({ GETH_CONNECTED: true, GETH_INITIATED: true, CONNECTING: false, GETH_FINISHED_SYNCING: false }))
  })

  ipcRenderer.on(ON_GETH_SERVER_DISCONNECTED, () => {
    store.dispatch(updateServerAttrib({ GETH_CONNECTED: false, CONNECTING: false }))
    // clear block info
    store.dispatch(clearGethBlockInfo())
  })

  ipcRenderer.on(ON_UI_SERVER_CONNECTED, () => {
    store.dispatch(updateServerAttrib({ UI_SERVER_CONNECTED: true }))
  })

  ipcRenderer.on(ON_UI_SERVER_DISCONNECTED, () => {
    store.dispatch(updateServerAttrib({ UI_SERVER_DISCONNECTED: false }))
  })

  ipcRenderer.on(PEER_COUNT_DATA, (event, data) => {
    store.dispatch(updateServerAttrib({ PEER_COUNT_DATA: data.peerCount }))
    if (!store.getState().serverStatus.GETH_FINISHED_SYNCING) {
      store.dispatch(updateServerAttrib({ GETH_SYNCING: data.peerCount > 0 ? true : false }))
    }
  })

  ipcRenderer.on(GETH_FINISHED_SYNCING, () => {
    if (store.getState().serverStatus.GETH_INITIATED) {
      startAugurNode()
    }
    store.dispatch(updateServerAttrib({ GETH_FINISHED_SYNCING: true, GETH_INITIATED: false, GETH_SYNCING: false }))
  })

  ipcRenderer.on(BULK_SYNC_STARTED, () => {
    store.dispatch(updateServerAttrib({ AUGUR_BULK_SYNCING: true }))
  })

  ipcRenderer.on(BULK_SYNC_FINISHED, () => {
    store.dispatch(updateServerAttrib({ AUGUR_BULK_SYNCING: false }))
  })

  ipcRenderer.on(INFO_NOTIFICATION, (event, notification) => {
    setTimeout(() => {
      store.dispatch(addInfoNotification(notification))
    }, 500)
    console.log('INFO_NOTIFICATION', notification)
  })

  ipcRenderer.on(ERROR_NOTIFICATION, (event, notification) => {
    store.dispatch(addErrorNotification(notification))

    console.log('ERROR_NOTIFICATION', notification)
  })

}
