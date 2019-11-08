export const UPDATE_CONNECTION_STATUS = "UPDATE_CONNECTION_STATUS";
export const UPDATE_IS_RECONNECTION_PAUSED = "UPDATE_IS_RECONNECTION_PAUSED";
export const UPDATE_HOTLOADING_STATUS = 'UPDATE_HOTLOADING_STATUS';

export function updateConnectionStatus(isConnected: boolean) {
  return {
    type: UPDATE_CONNECTION_STATUS,
    data: { isConnected }
  };
}

export function updateIsReconnectionPaused(isReconnectionPaused: boolean) {
  return {
    type: UPDATE_IS_RECONNECTION_PAUSED,
    data: { isReconnectionPaused }
  };
}

export function updateCanHotload(canHotload: boolean) {
  return {
    type: UPDATE_HOTLOADING_STATUS,
    data: { canHotload }
  };
}

