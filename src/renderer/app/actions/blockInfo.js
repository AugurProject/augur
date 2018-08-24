export const AUGUR_NODE_UPDATE_BLOCK_INFO = 'AUGUR_NODE_UPDATE_BLOCK_INFO'
export const GETH_NODE_UPDATE_BLOCK_INFO = 'GETH_NODE_UPDATE_BLOCK_INFO'

export function augurNodeUpdateBlockInfo(blockInfo) {
  return {
    type: AUGUR_NODE_UPDATE_BLOCK_INFO,
    blockInfo
  }
}

export function gethNodeUpdateBlockInfo(blockInfo) {
  return {
    type: GETH_NODE_UPDATE_BLOCK_INFO,
    blockInfo
  }
}
