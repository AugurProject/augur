import {
  UPDATE_MARKET_LOADING,
  REMOVE_MARKET_LOADING
} from "modules/markets/actions/update-market-loading";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(marketLoading = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKET_LOADING: {
      const { marketLoadingState } = action.data;
      return {
        ...marketLoading,
        ...marketLoadingState
      };
    }
    case REMOVE_MARKET_LOADING:
      return Object.keys(marketLoading).reduce(
        (p, marketId) =>
          marketId !== action.data.marketLoadingState
            ? { ...p, [marketId]: marketLoading[marketId] }
            : p,
        {}
      );
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return marketLoading;
  }
}
