import { UPDATE_SELECTED_MARKET_ID, CLEAR_SELECTED_MARKET_ID } from 'modules/market/actions/update-selected-market-id'

const DEFAULT_STATE = null

export default function (selectedMarketID = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_SELECTED_MARKET_ID:
      return action.data.selectedMarketID
    case CLEAR_SELECTED_MARKET_ID:
      return DEFAULT_STATE
    default:
      return selectedMarketID
  }
}
