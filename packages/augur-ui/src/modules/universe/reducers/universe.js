import { UPDATE_UNIVERSE } from 'modules/universe/actions/update-universe'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (universe = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_UNIVERSE:
      return {
        ...universe,
        ...action.universe,
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return universe
  }
}
