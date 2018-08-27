
import { pull } from 'lodash'
import { RESET_STATE } from '../app/actions/reset-state'
import { INITIALIZE_CONFIG, UPDATE_CONFIG, ADD_CONNECTION, REMOVE_CONNECTION } from '../app/actions/configuration'

const DEFAULT_STATE = []

export default function (configuration = DEFAULT_STATE, action) {
  switch (action.type) {
    case INITIALIZE_CONFIG:
      return action.configuration
    case UPDATE_CONFIG:
      return Object.assign(configuration, action.config)
    case ADD_CONNECTION:
      configuration.networks = [...configuration.networks, action.connection]
      return configuration
    case REMOVE_CONNECTION:
      configuration.networks = pull(configuration.networks, action.connection)
      return configuration
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return configuration
  }
}
