import { UPDATE_IS_ANIMATING } from 'modules/app/actions/update-is-animating'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = false

export default function (isAnimating = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_IS_ANIMATING:
      return action.data.isAnimating
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return isAnimating
  }
}
