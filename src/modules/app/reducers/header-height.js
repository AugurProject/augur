import { UPDATE_HEADER_HEIGHT } from 'modules/app/actions/update-header-height'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = 0

export default function (headerHeight = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_HEADER_HEIGHT:
      return action.data.headerHeight
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return headerHeight
  }
}
