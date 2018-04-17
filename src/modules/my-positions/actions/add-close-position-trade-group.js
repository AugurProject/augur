export const ADD_CLOSE_POSITION_TRADE_GROUP = 'ADD_CLOSE_POSITION_TRADE_GROUP_ID'

export function addClosePositionTradeGroup(marketId, outcomeId, tradeGroupId) {
  return {
    type: ADD_CLOSE_POSITION_TRADE_GROUP,
    marketId,
    outcomeId,
    tradeGroupId,
  }
}
