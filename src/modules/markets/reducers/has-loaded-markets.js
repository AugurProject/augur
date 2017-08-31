import { UPDATE_HAS_LOADED_MARKETS } from 'modules/markets/actions/update-has-loaded-markets'

export default function (hasLoadedMarkets = false, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_MARKETS:
      return action.hasLoadedMarkets
    default:
      return hasLoadedMarkets
  }
}
