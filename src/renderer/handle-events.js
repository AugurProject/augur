const {ipcRenderer} = require('electron')
import { each } from 'lodash'
import { CONFIG } from '../utils/constants'
import { addUpdateConnection } from './app/actions/connections'
import store from './store'

export const handleEvents = () => {

  ipcRenderer.on('ready', () => {
    console.log('app is ready')
  })

  ipcRenderer.on(CONFIG, (event, config) => {
    each(config.networks, network => store.dispatch(addUpdateConnection(network)))
  })

}
