export const UPDATE_MARKET_LOADING = "UPDATE_MARKET_LOADING";
export const REMOVE_MARKET_LOADING = "REMOVE_MARKET_LOADING";

/**
 * Updates the respective market's current loading state
 * @param {object} data.<string, string> - An index of market loading states keyed by marketId
 */
export function updateMarketLoading(marketLoadingState) {
  return {
    type: UPDATE_MARKET_LOADING,
    data: { marketLoadingState }
  };
}

/**
 * Removes a market's current loading state
 * @param data
 */
export function removeMarketLoading(marketLoadingState) {
  return {
    type: REMOVE_MARKET_LOADING,
    data: { marketLoadingState }
  };
}
