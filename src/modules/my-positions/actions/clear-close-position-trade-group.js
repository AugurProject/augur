export const CLEAR_CLOSE_POSITION_TRADE_GROUP = 'REMOVE_CLOSE_POSITION_TRADE_GROUP_ID';

export function clearClosePositionTradeGroup(marketID, outcomeID) {
  return {
    type: CLEAR_CLOSE_POSITION_TRADE_GROUP,
    marketID,
    outcomeID
  };
}
