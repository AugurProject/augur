import { UPDATE_SCALAR_MARKET_SHARE_DENOMINATION } from 'modules/market/actions/update-scalar-market-share-denomination'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (denominations = DEFAULT_STATE, action) {
  switch (action.type) {
    case (UPDATE_SCALAR_MARKET_SHARE_DENOMINATION):
      return {
        ...denominations,
        [action.data.marketId]: action.data.denomination,
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return denominations
  }
}
