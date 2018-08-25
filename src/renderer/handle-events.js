const {ipcRenderer} = require('electron')
import { each } from 'lodash'
import { SSL, CONFIG, LATEST_SYNCED_BLOCK, LATEST_SYNCED_GETH_BLOCK, ON_SERVER_CONNECTED, ON_SERVER_DISCONNECTED, PEER_COUNT_DATA, GETH_FINISHED_SYNCING } from '../utils/constants'
import { addUpdateConnection } from './app/actions/connections'
import { updateBlockInfo } from './app/actions/blockInfo'
import { updateServerAttrib } from './app/actions/serverStatus'
import store from './store'

export const handleEvents = () => {

  ipcRenderer.on('ready', () => {
    console.log('app is ready')
  })

  ipcRenderer.on(CONFIG, (event, networks) => {
    each(networks, network => store.dispatch(addUpdateConnection(network)))
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

  ipcRenderer.on(PEER_COUNT_DATA, (event, data) => {
    store.dispatch(updateServerAttrib({ PEER_COUNT_DATA: data.peerCount }))
  })

  ipcRenderer.on(GETH_FINISHED_SYNCING, () => {
    store.dispatch(updateServerAttrib({ GETH_FINISHED_SYNCING: true }))
  })

  ipcRenderer.on(SSL, (event, enabled) => {
    store.dispatch(updateServerAttrib({ SSL: enabled }))
  })

}
