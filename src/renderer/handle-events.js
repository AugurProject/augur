const {ipcRenderer} = require('electron')
import { each } from 'lodash'
import { CONFIG, LATEST_SYNCED_BLOCK, LATEST_SYNCED_GETH_BLOCK, ON_SERVER_CONNECTED, ON_SERVER_DISCONNECTED } from '../utils/constants'
import { addUpdateConnection } from './app/actions/connections'
import { updateBlockInfo } from './app/actions/blockInfo'
import { updateServerStatus } from './app/actions/serverStatus'
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
    store.dispatch(updateServerStatus(true))
  })

  ipcRenderer.on(ON_SERVER_DISCONNECTED, () => {
    store.dispatch(updateServerStatus(false))
  })
}
