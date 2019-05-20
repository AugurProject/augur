import { AccountPosition, BaseAction } from "modules/types";

import { UPDATE_ACCOUNT_POSITIONS_DATA } from "modules/positions/actions/account-positions";
import { CLEAR_LOGIN_ACCOUNT } from "modules/account/actions/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE: AccountPosition = {};

export default function(accountPositions = DEFAULT_STATE, action: BaseAction) {
  switch (action.type) {
    case UPDATE_ACCOUNT_POSITIONS_DATA: {
      const { positionData, marketId } = action.data;
      if (positionData) {
        if (marketId) {
          return {
            ...accountPositions,
            [marketId]: {
              ...positionData[marketId]
            }
          };
        }
        return {
          ...accountPositions,
          ...positionData
        };
      }
      return accountPositions;
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return accountPositions;
  }
}
