import { RESET_STATE } from "modules/app/actions/reset-state";
import {
  UPDATE_FILTER_SORT_OPTIONS,
  MARKET_FILTER,
  MARKET_SORT,
  MARKET_MAX_FEES,
  TRANSACTION_PERIOD,
  HAS_OPEN_ORDERS
} from "modules/filter-sort/actions/update-filter-sort-options";
import {
  MAX_FEE_05_PERCENT,
  MARKET_OPEN,
  MARKET_OPEN_INTEREST,
  DAY
} from "modules/common-elements/constants";

const DEFAULT_STATE = {
  [MARKET_FILTER]: MARKET_OPEN,
  [MARKET_SORT]: MARKET_OPEN_INTEREST,
  [MARKET_MAX_FEES]: MAX_FEE_05_PERCENT,
  [TRANSACTION_PERIOD]: DAY,
  [HAS_OPEN_ORDERS]: false
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(filterSortOptions = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_FILTER_SORT_OPTIONS: {
      const { optionKey, optionValue } = data;
      if (KEYS.includes(optionKey))
        return {
          ...filterSortOptions,
          [optionKey]: optionValue
        };
      return filterSortOptions;
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return filterSortOptions;
  }
}
