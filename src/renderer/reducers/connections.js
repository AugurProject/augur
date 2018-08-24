
import immutableDelete from 'immutable-delete'
import { RESET_STATE } from '../app/actions/reset-state'
import { ADD_UPDATE_CONNECTION, REMOVE_CONNECTION, CLEAR_CONNECTIONS } from '../app/actions/connections'

const DEFAULT_STATE = {}

export default function (connections = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_UPDATE_CONNECTION:
      return {
        ...connections,
        ...action.connection,
      }
    case REMOVE_CONNECTION:
      return immutableDelete(connections, action.connection)
    case RESET_STATE:
    case CLEAR_CONNECTIONS:
      return DEFAULT_STATE
    default:
      return connections
  }
}
