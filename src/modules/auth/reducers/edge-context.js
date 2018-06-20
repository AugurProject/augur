import { UPDATE_EDGE_CONTEXT } from 'modules/auth/actions/show-edge-login'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = null

export default function (edgeContext = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_EDGE_CONTEXT:
      return action.data
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return edgeContext
  }
}
