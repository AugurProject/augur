import { UPDATE_IS_MOBILE } from 'modules/app/actions/update-is-mobile'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = false

export default function (isMobile = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_IS_MOBILE:
      return action.data.isMobile
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return isMobile
  }
}
