export const UPDATE_CONNECTION_STATUS = "UPDATE_CONNECTION_STATUS";
export const UPDATE_AUGUR_NODE_CONNECTION_STATUS =
  "UPDATE_AUGUR_NODE_CONNECTION_STATUS";
export const UPDATE_AUGUR_NODE_NETWORK_ID = "UPDATE_AUGUR_NODE_NETWORK_ID";
export const UPDATE_IS_RECONNECTION_PAUSED = "UPDATE_IS_RECONNECTION_PAUSED";

/**
 * @param {Boolean} isConnected
 * @return {{type: string, isConnected: *}} returns action
 */
export function updateConnectionStatus(isConnected: Boolean) {
  return {
    type: UPDATE_CONNECTION_STATUS,
    data: { isConnected }
  };
}

/**
 * @param {Boolean} isConnected
 * @return {{type: string, isConnected: *}} returns action
 */
export function updateAugurNodeConnectionStatus(isConnectedToAugurNode: Boolean) {
  return {
    type: UPDATE_AUGUR_NODE_CONNECTION_STATUS,
    data: { isConnectedToAugurNode }
  };
}

/**
 * @param {string} augurNodeNetworkId
 * @return {{type: string, augurNodeNetworkId: *}} returns action
 */
export function updateAugurNodeNetworkId(augurNodeNetworkId: String) {
  return {
    type: UPDATE_AUGUR_NODE_NETWORK_ID,
    data: { augurNodeNetworkId }
  };
}

/**
 * @param {Boolean} isReconnectionPaused
 * @return {{type: string, isReconnectionPaused: *}} returns action
 */
export function updateIsReconnectionPaused(isReconnectionPaused: Boolean) {
  return {
    type: UPDATE_IS_RECONNECTION_PAUSED,
    data: { isReconnectionPaused }
  };
}
