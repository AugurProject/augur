export const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';

/**
 * 
 * @param {Boolean} isConnected
 * @return {{type: string, isConnected: *}} returns action
 */
export function updateConnectionStatus(isConnected) {
    return { type: UPDATE_CONNECTION_STATUS, isConnected };
}