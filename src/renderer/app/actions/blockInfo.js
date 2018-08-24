export const UPDATE_BLOCK_INFO = 'UPDATE_BLOCK_INFO'

export function updateBlockInfo(blockInfo) {
  return {
    type: UPDATE_BLOCK_INFO,
    blockInfo
  }
}
