import { UPDATE_FOOTER_HEIGHT } from 'modules/app/actions/update-footer-height'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = 0

export default function (footerHeight = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_FOOTER_HEIGHT:
      return action.data.footerHeight
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return footerHeight
  }
}
