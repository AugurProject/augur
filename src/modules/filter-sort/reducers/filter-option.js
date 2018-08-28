import { UPDATE_FILTER_OPTION } from "modules/filter-sort/actions/update-filter-option";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { MARKET_OPEN } from "modules/filter-sort/constants/market-states";

const DEFAULT_STATE = MARKET_OPEN;

export default function(filterOption = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_FILTER_OPTION:
      return action.data;
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return filterOption;
  }
}
