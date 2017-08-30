export const CLEAR_CLOSE_POSITION_OUTCOME = 'CLEAR_CLOSE_POSITION_OUTCOME'

export function clearClosePositionOutcome(marketID, outcomeID) {
  return {
    type: CLEAR_CLOSE_POSITION_OUTCOME,
    marketID,
    outcomeID
  }
}
