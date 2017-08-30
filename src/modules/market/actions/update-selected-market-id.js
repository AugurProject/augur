export const UPDATE_SELECTED_MARKET_ID = 'UPDATE_SELECTED_MARKET_ID'
export const CLEAR_SELECTED_MARKET_ID = 'CLEAR_SELECTED_MARKET_ID'

export function updateSelectedMarketID(selectedMarketID) {
  return {
    type: UPDATE_SELECTED_MARKET_ID,
    data: {
      selectedMarketID
    }
  }
}

export function clearSelectedMarketID() {
  return {
    type: CLEAR_SELECTED_MARKET_ID
  }
}
