import {
  UPDATE_TRADE_IN_PROGRESS,
  CLEAR_TRADE_IN_PROGRESS
} from "modules/trades/actions/update-trades-in-progress";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(tradesInProgress = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_TRADE_IN_PROGRESS: {
      const { marketId, outcomeId, details } = data;
      return {
        ...tradesInProgress,
        [marketId]: {
          ...tradesInProgress[marketId],
          [outcomeId]: {
            ...details
          }
        }
      };
    }
    case CLEAR_TRADE_IN_PROGRESS: {
      const { marketId } = data;
      return {
        ...tradesInProgress,
        [marketId]: {}
      };
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return tradesInProgress;
  }
}
