import { omit } from 'lodash'

import { RESET_STATE } from '../app/actions/reset-state'
import { INITIALIZE_CONFIG, UPDATE_CONFIG, UPDATE_SELECTED, ADD_UPDATE_CONNECTION, REMOVE_CONNECTION } from '../app/actions/configuration'

const DEFAULT_STATE = []

export default function (configuration = DEFAULT_STATE, action) {
  switch (action.type) {
    case INITIALIZE_CONFIG:
      return action.configuration
    case UPDATE_CONFIG:
      return {
        ...configuration,
        ...action.config
      }
    case UPDATE_SELECTED:
      if (!action.selectedKey) return configuration
      const networks = configuration.networks
      Object.keys(networks).forEach(key => networks[key].selected = key === action.selectedKey ? true : false)
      return {
        ...configuration,
        networks
      }
    case ADD_UPDATE_CONNECTION:
      return {
        ...configuration,
        networks: {
          ...configuration.networks,
          [action.key]: action.connection
      }
    }
    case REMOVE_CONNECTION:
      let configNetworks = configuration.networks
      if (configNetworks[action.key].selected) {
        configNetworks['mainnet'].selected = true
      }
      configNetworks = omit(configNetworks, action.key)

      return {
        ...configuration,
        networks: configNetworks
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return configuration
  }
}
