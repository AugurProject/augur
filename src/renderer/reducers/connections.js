
import { RESET_STATE } from '../app/actions/reset-state'
import { ADD_UPDATE_CONNECTION, REMOVE_CONNECTION, CLEAR_CONNECTIONS } from '../app/actions/connections'

const DEFAULT_STATE = []

export default function (connections = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_UPDATE_CONNECTION:
      return [...connections.filter(c => c.name !== action.connection.name), action.connection]
    case REMOVE_CONNECTION:
      return connections.filter(network => network.name !== action.connection.name)
    case RESET_STATE:
    case CLEAR_CONNECTIONS:
      return DEFAULT_STATE
    default:
      return connections
  }
}
