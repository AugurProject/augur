export const UPDATE_CONNECTION_STATUS = "UPDATE_CONNECTION_STATUS";
export const UPDATE_IS_RECONNECTION_PAUSED = "UPDATE_IS_RECONNECTION_PAUSED";

/**
 * @param {Boolean} isConnected
 * @return {{type: string, isConnected: *}} returns action
 */
export function updateConnectionStatus(isConnected: boolean) {
  return {
    type: UPDATE_CONNECTION_STATUS,
    data: { isConnected }
  };
}

/**
 * @param {Boolean} isReconnectionPaused
 * @return {{type: string, isReconnectionPaused: *}} returns action
 */
export function updateIsReconnectionPaused(isReconnectionPaused: boolean) {
  return {
    type: UPDATE_IS_RECONNECTION_PAUSED,
    data: { isReconnectionPaused }
  };
}
