import { RESET_STATE } from "modules/app/actions/reset-state";
import { MARKET_OPEN } from "modules/filter-sort/constants/market-states";
import { MARKET_OPEN_INTEREST } from "modules/filter-sort/constants/market-sort-params";
import { DAY } from "modules/transactions/constants/transaction-periods";
import {
  UPDATE_FILTER_SORT_OPTIONS,
  MARKET_FILTER,
  MARKET_SORT,
  TRANSACTION_PERIOD
} from "modules/filter-sort/actions/update-filter-sort-options";

const DEFAULT_STATE = {
  [MARKET_FILTER]: MARKET_OPEN,
  [MARKET_SORT]: MARKET_OPEN_INTEREST,
  [TRANSACTION_PERIOD]: DAY
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
