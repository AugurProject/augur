export const UPDATE_HAS_LOADED_MARKETS = 'UPDATE_HAS_LOADED_MARKETS'

export function updateHasLoadedMarkets(hasLoadedMarkets) {
  return { type: UPDATE_HAS_LOADED_MARKETS, hasLoadedMarkets }
}
