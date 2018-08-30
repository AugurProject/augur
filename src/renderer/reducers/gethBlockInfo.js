
import { UPDATE_GETH_BLOCK_INFO, CLEAR_GETH_BLOCK_INFO } from '../app/actions/blockInfo'

const DEFAULT_STATE = {}

export default function (augurNodeBlockInfo = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_GETH_BLOCK_INFO:
      return action.blockInfo
    case CLEAR_GETH_BLOCK_INFO:
      return DEFAULT_STATE
    default:
      return augurNodeBlockInfo
  }
}
