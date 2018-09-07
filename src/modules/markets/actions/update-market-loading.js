export const UPDATE_MARKET_LOADING = "UPDATE_MARKET_LOADING";
export const REMOVE_MARKET_LOADING = "REMOVE_MARKET_LOADING";
export const UPDATE_HAS_LOADED_MARKETS = "UPDATE_HAS_LOADED_MARKETS";

/**
 * Updates the respective market's current loading state
 * @param {object} data.<string, string> - An index of market loading states keyed by marketId
 */
export function updateMarketLoading(data) {
  return {
    type: UPDATE_MARKET_LOADING,
    data
  };
}

/**
 * Removes a market's current loading state
 * @param data
 */
export function removeMarketLoading(data) {
  return {
    type: REMOVE_MARKET_LOADING,
    data
  };
}

export function updateHasLoadedMarkets(hasLoadedMarkets) {
  return { type: UPDATE_HAS_LOADED_MARKETS, hasLoadedMarkets };
}
