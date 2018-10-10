import { UPDATE_MARKET_PRICE_HISTORY } from "modules/markets/actions/price-history-management";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(priceHistory = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKET_PRICE_HISTORY:
      return {
        ...priceHistory,
        [action.data.marketId]: action.data.priceHistory
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return priceHistory;
  }
}
