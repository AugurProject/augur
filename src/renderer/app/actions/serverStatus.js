export const UPDATE_SERVER_STATUS = 'AUGUR_NODE_UPDATE_BLOCK_INFO'

export function updateServerStatus(status) {
  return {
    type: UPDATE_SERVER_STATUS,
    status
  }
}
