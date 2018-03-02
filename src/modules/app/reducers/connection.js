import { UPDATE_CONNECTION_STATUS, UPDATE_AUGUR_NODE_CONNECTION_STATUS, UPDATE_IS_RECONNECTION_PAUSED } from 'modules/app/actions/update-connection'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = { isConnected: false, isConnectedToAugurNode: false, isReconnectionPaused: false }

export default function (connection = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_CONNECTION_STATUS:
      return {
        ...connection,
        isConnected: action.isConnected,
      }
    case UPDATE_AUGUR_NODE_CONNECTION_STATUS:
      return {
        ...connection,
        isConnectedToAugurNode: action.isConnected,
      }
    case UPDATE_IS_RECONNECTION_PAUSED:
      return {
        ...connection,
        isReconnectionPaused: action.isReconnectionPaused
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return connection
  }
}
