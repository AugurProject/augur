export const UPDATE_SELECTED_MARKET_ID = 'UPDATE_SELECTED_MARKET_ID'
export const CLEAR_SELECTED_MARKET_ID = 'CLEAR_SELECTED_MARKET_ID'

export function updateSelectedMarketId(selectedMarketId) {
  return {
    type: UPDATE_SELECTED_MARKET_ID,
    data: {
      selectedMarketId,
    },
  }
}

export function clearSelectedMarketId() {
  return {
    type: CLEAR_SELECTED_MARKET_ID,
  }
}
