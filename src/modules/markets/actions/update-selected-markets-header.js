export const UPDATE_SELECTED_MARKETS_HEADER = 'UPDATE_SELECTED_MARKETS_HEADER'

export function updateSelectedMarketsHeader(selectedMarketsHeader) {
  return { type: UPDATE_SELECTED_MARKETS_HEADER, selectedMarketsHeader }
}
