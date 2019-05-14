export const UPDATE_ACCOUNT_TRADES_DATA = "UPDATE_ACCOUNT_TRADES_DATA";
export const UPDATE_ACCOUNT_POSITIONS_DATA = "UPDATE_ACCOUNT_POSITIONS_DATA";
export const CLEAR_ACCOUNT_TRADES = "CLEAR_ACCOUNT_TRADES";

export function clearAccountTrades() {
  return { type: CLEAR_ACCOUNT_TRADES };
}
export const updateAccountPositionsData = (
  positionData: any,
  marketId: String
) => ({
  type: UPDATE_ACCOUNT_POSITIONS_DATA,
  data: {
    positionData,
    marketId
  }
});
export const updateAccountTradeData = (tradeData: any, market: any) => ({
  type: UPDATE_ACCOUNT_TRADES_DATA,
  data: {
    tradeData,
    market
  }
});
