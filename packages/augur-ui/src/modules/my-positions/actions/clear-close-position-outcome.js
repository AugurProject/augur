export const CLEAR_CLOSE_POSITION_OUTCOME = 'CLEAR_CLOSE_POSITION_OUTCOME'

export function clearClosePositionOutcome(marketId, outcomeId) {
  return {
    type: CLEAR_CLOSE_POSITION_OUTCOME,
    marketId,
    outcomeId,
  }
}
