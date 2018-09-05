export const UPDATE_MARKET_TRADING_HISTORY = "UPDATE_MARKET_TRADING_HISTORY";

export function updateMarketTradingHistory(marketId, tradingHistory) {
  return {
    type: UPDATE_MARKET_TRADING_HISTORY,
    marketId,
    tradingHistory
  };
}
