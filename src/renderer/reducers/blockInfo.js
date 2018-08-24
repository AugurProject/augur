
import { RESET_STATE } from '../app/actions/reset-state'
import { UPDATE_BLOCK_INFO } from '../app/actions/blockInfo'

const DEFAULT_STATE = {}

export default function (augurNodeBlockInfo = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_BLOCK_INFO:
      return action.blockInfo
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return augurNodeBlockInfo
  }
}
