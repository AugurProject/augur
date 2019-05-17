import {
  POSITION_ACTIONS,
  AccountPosition,
  AccountPositionAction,
} from "modules/common/types/account-positions";
import { LOGIN_ACTIONS } from "modules/common/types/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE: AccountPosition = {};

export default function(
  accountPositions = DEFAULT_STATE,
  action: AccountPositionAction,
) {
  switch (action.type) {
    case POSITION_ACTIONS.UPDATE_ACCOUNT_POSITIONS_DATA: {
      const { positionData, marketId } = action.data;
      if (positionData) {
        if (marketId) {
          return {
            ...accountPositions,
            [marketId]: {
              ...positionData[marketId],
            },
          };
        }
        return {
          ...accountPositions,
          ...positionData,
        };
      }
      return accountPositions;
    }
    case RESET_STATE:
    case LOGIN_ACTIONS.CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return accountPositions;
  }
}
