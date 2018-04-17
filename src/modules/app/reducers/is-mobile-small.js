import { UPDATE_IS_MOBILE_SMALL } from 'modules/app/actions/update-is-mobile'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = false

export default function (isMobileSmall = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_IS_MOBILE_SMALL:
      return action.data.isMobileSmall
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return isMobileSmall
  }
}
