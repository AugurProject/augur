export const ADD_CLOSE_POSITION_TRADE_GROUP = 'ADD_CLOSE_POSITION_TRADE_GROUP_ID'
export const REMOVE_CLOSE_POSITION_TRADE_GROUP = 'REMOVE_CLOSE_POSITION_TRADE_GROUP_ID'

export function addClosePositionTradeGroup(marketId, outcomeId, tradeGroupId) {
  return {
    type: ADD_CLOSE_POSITION_TRADE_GROUP,
    marketId,
    outcomeId,
    tradeGroupId,
  }
}

export function removeClosePositionTradeGroup(marketId, outcomeId, tradeGroupId) {
  return {
    type: REMOVE_CLOSE_POSITION_TRADE_GROUP,
    marketId,
    outcomeId,
    tradeGroupId,
  }
}
