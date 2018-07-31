import { UPDATE_HAS_LOADED_MARKETS } from 'modules/markets/actions/update-has-loaded-markets'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = false

export default function (hasLoadedMarkets = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_MARKETS:
      return action.hasLoadedMarkets
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return hasLoadedMarkets
  }
}
