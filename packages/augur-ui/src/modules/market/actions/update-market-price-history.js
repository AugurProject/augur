export const UPDATE_MARKET_PRICE_HISTORY = 'UPDATE_MARKET_PRICE_HISTORY'

export function updateMarketPriceHistory(marketId, priceHistory) {
  return {
    type: UPDATE_MARKET_PRICE_HISTORY,
    marketId,
    priceHistory,
  }
}
