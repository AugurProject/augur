export const UPDATE_GETH_BLOCK_INFO = 'UPDATE_BLOCK_INFO'
export const CLEAR_GETH_BLOCK_INFO = 'CLEAR_BLOCK_INFO'
export const UPDATE_AUGUR_NODE_BLOCK_INFO = 'UPDATE_BLOCK_INFO'
export const CLEAR_AUGUR_NODE_BLOCK_INFO = 'CLEAR_BLOCK_INFO'

export function updateGethBlockInfo(blockInfo) {
  return {
    type: UPDATE_GETH_BLOCK_INFO,
    blockInfo
  }
}

export function clearGethBlockInfo() {
  return {
    type: CLEAR_GETH_BLOCK_INFO,
  }
}

export function updateAugurNodeBlockInfo(blockInfo) {
  return {
    type: UPDATE_AUGUR_NODE_BLOCK_INFO,
    blockInfo
  }
}

export function clearAugurNodeBlockInfo() {
  return {
    type: CLEAR_AUGUR_NODE_BLOCK_INFO,
  }
}
