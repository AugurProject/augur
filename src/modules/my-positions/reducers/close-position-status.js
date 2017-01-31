import { UPDATE_CLOSE_POSITION_STATUS } from 'modules/my-positions/actions/update-close-position-status';

export default function (closePositionStatus = {}, action) {
  switch (action.type) {
    case UPDATE_CLOSE_POSITION_STATUS:
      return {
        ...closePositionStatus,
        [action.marketID]: {
          ...closePositionStatus[action.marketID],
          [action.outcomeID]: action.status
        }
      };
    default:
      return closePositionStatus;
  }
}
