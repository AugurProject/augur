import { RESET_STATE } from 'modules/app/actions/reset-state';
import {
  UPDATE_FILTER_SORT_OPTIONS,
  MARKET_FILTER,
  MARKET_SORT,
  MARKET_MAX_FEES,
  TRANSACTION_PERIOD,
  HAS_OPEN_ORDERS,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import {
  MAX_FEE_100_PERCENT,
  MARKET_OPEN,
  MARKET_SORT_PARAMS,
  DAY,
  MAX_SPREAD_ALL_SPREADS,
} from 'modules/common/constants';
import { FilterSortOptions, BaseAction } from 'modules/types';

const DEFAULT_STATE: FilterSortOptions = {
  [MARKET_FILTER]: MARKET_OPEN,
  [MARKET_SORT]: MARKET_SORT_PARAMS.OPEN_INTEREST,
  [MARKET_MAX_FEES]: MAX_FEE_100_PERCENT,
  [MARKET_MAX_SPREAD]: MAX_SPREAD_ALL_SPREADS,
  [MARKET_SHOW_INVALID]: "hide",
  [TRANSACTION_PERIOD]: DAY,
  [HAS_OPEN_ORDERS]: false,
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(
  filterSortOptions: FilterSortOptions = DEFAULT_STATE,
  { type, data }: BaseAction
): FilterSortOptions {
  switch (type) {
    case UPDATE_FILTER_SORT_OPTIONS: {
      const { optionKey, optionValue } = data;
      if (KEYS.includes(optionKey))
        return {
          ...filterSortOptions,
          [optionKey]: optionValue,
        };
      return filterSortOptions;
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return filterSortOptions;
  }
}
