export const MARKET_DATA_LOADING = 'UPDATE_MARKET_DATA_LOADING';

export function updateMarketDataLoading(marketID, status) {
  return {
    type: MARKET_DATA_LOADING,
    marketID,
    status
  };
}
