import { AccountPosition, BaseAction } from "modules/types";

import { UPDATE_ACCOUNT_RAW_POSITIONS_DATA } from "modules/positions/actions/account-positions";
import { CLEAR_LOGIN_ACCOUNT } from "modules/account/actions/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE: AccountPosition = {};

export default function(accountPositions = DEFAULT_STATE, { type, data }: BaseAction): AccountPosition {
  switch (type) {
    case UPDATE_ACCOUNT_RAW_POSITIONS_DATA: {
      const { positionData, marketId } = data;
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
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return accountPositions;
  }
}
