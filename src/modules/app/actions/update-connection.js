export const UPDATE_CONNECTION_STATUS = "UPDATE_CONNECTION_STATUS";
export const UPDATE_AUGUR_NODE_CONNECTION_STATUS =
  "UPDATE_AUGUR_NODE_CONNECTION_STATUS";
export const UPDATE_AUGUR_NODE_NETWORK_ID = "UPDATE_AUGUR_NODE_NETWORK_ID";
export const UPDATE_IS_RECONNECTION_PAUSED = "UPDATE_IS_RECONNECTION_PAUSED";
export const UPDATE_USE_WEBSOCKET_TO_CONNECT_AUGUR_NODE =
  "USE_WEBSOCKET_TO_CONNECT_AUGUR_NODE";

/**
 * @param {Boolean} isConnected
 * @return {{type: string, isConnected: *}} returns action
 */
export function updateConnectionStatus(isConnected) {
  return {
    type: UPDATE_CONNECTION_STATUS,
    data: { isConnected }
  };
}

/**
 * @param {Boolean} isConnectedToAugurNode
 * @return {{type: string, isConnected: *}} returns action
 */
export function updateAugurNodeConnectionStatus(isConnectedToAugurNode) {
  return {
    type: UPDATE_AUGUR_NODE_CONNECTION_STATUS,
    data: { isConnectedToAugurNode }
  };
}

/**
 * @param {string} augurNodeNetworkId
 * @return {{type: string, augurNodeNetworkId: *}} returns action
 */
export function updateAugurNodeNetworkId(augurNodeNetworkId) {
  return {
    type: UPDATE_AUGUR_NODE_NETWORK_ID,
    data: { augurNodeNetworkId }
  };
}

/**
 * @param {Boolean} isReconnectionPaused
 * @return {{type: string, isReconnectionPaused: *}} returns action
 */
export function updateIsReconnectionPaused(isReconnectionPaused) {
  return {
    type: UPDATE_IS_RECONNECTION_PAUSED,
    data: { isReconnectionPaused }
  };
}

/**
 * @param {Boolean} useWebsocketToConnectAugurNode
 * @return {{type: string, useWebsocketToConnectAugurNode: *}} returns action
 */
export function updateUseWebsocketToConnectAugurNode(
  useWebsocketToConnectAugurNode
) {
  return {
    type: UPDATE_USE_WEBSOCKET_TO_CONNECT_AUGUR_NODE,
    data: { useWebsocketToConnectAugurNode }
  };
}
