
import { RESET_STATE } from '../app/actions/reset-state'
import { UPDATE_SERVER_STATUS } from '../app/actions/serverStatus'

const DEFAULT_STATE = {}

export default function (augurNodeBlockInfo = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_SERVER_STATUS:
      return action.status
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return augurNodeBlockInfo
  }
}
