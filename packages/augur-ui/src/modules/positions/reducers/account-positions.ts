import { AccountPosition, BaseAction } from "modules/types";

import { UPDATE_ACCOUNT_POSITIONS_DATA } from "modules/positions/actions/account-positions";
import { APP_STATUS_ACTIONS } from "modules/app/store/constants";
import { RESET_STATE } from "modules/app/actions/reset-state";
const { CLEAR_LOGIN_ACCOUNT } = APP_STATUS_ACTIONS;

const DEFAULT_STATE: AccountPosition = {};

export default function(accountPositions = DEFAULT_STATE, { type, data }: BaseAction): AccountPosition {
  switch (type) {
    case UPDATE_ACCOUNT_POSITIONS_DATA: {
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
