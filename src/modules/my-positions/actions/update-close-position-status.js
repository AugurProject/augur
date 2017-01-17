export const UPDATE_CLOSE_POSITION_STATUS = 'UPDATE_CLOSE_POSITION_STATUS';

export function updateClosePositionStatus(marketID, outcomeID, status) {
  return {
    type: UPDATE_CLOSE_POSITION_STATUS,
    marketID,
    outcomeID,
    status
  };
}
