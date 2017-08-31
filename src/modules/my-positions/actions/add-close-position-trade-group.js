export const ADD_CLOSE_POSITION_TRADE_GROUP = 'ADD_CLOSE_POSITION_TRADE_GROUP_ID'

export function addClosePositionTradeGroup(marketID, outcomeID, tradeGroupID) {
  return {
    type: ADD_CLOSE_POSITION_TRADE_GROUP,
    marketID,
    outcomeID,
    tradeGroupID
  }
}
