import { UPDATE_CONNECTION_STATUS, UPDATE_AUGUR_NODE_CONNECTION_STATUS } from 'modules/app/actions/update-connection'

export default function (connection = { isConnected: false, isConnectedToAugurNode: false }, action) {
  switch (action.type) {
    case UPDATE_CONNECTION_STATUS:
      return {
        ...connection,
        isConnected: action.isConnected
      }

    case UPDATE_AUGUR_NODE_CONNECTION_STATUS:
      return {
        ...connection,
        isConnectedToAugurNode: action.isConnected
      }

    default:
      return connection
  }
}
