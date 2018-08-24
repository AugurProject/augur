export const UPDATE_SERVER_STATUS = 'UPDATE_SERVER_STATUS'

export function updateServerStatus(status) {
  return {
    type: UPDATE_SERVER_STATUS,
    status
  }
}
