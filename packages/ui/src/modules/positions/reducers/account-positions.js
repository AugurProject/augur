import { UPDATE_ACCOUNT_POSITIONS_DATA } from "modules/positions/actions/update-account-trades-data";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(accountPositions = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_ACCOUNT_POSITIONS_DATA: {
      const { positionData, marketId } = data;
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
