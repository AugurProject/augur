import { UPDATE_SELECTED_MARKET_ID, CLEAR_SELECTED_MARKET_ID } from 'modules/market/actions/update-selected-market-id'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = null

export default function (selectedMarketId = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_SELECTED_MARKET_ID:
      return action.data.selectedMarketId
    case RESET_STATE:
    case CLEAR_SELECTED_MARKET_ID:
      return DEFAULT_STATE
    default:
      return selectedMarketId
  }
}
