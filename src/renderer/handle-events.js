const {ipcRenderer} = require('electron')
import { each } from 'lodash'
import { CONFIG } from '../utils/events'
import { addUpdateConnection } from './app/actions/connections'

export const handleEvents = () => {

  ipcRenderer.on(CONFIG, (config) => {
    each(config.networks, (n) => {
      addUpdateConnection(n)
    })
  })



}
