import { RESET_STATE } from 'modules/app/actions/reset-state';
import {
  MARKET_FILTER,
  MARKET_SORT,
  MARKET_MAX_FEES,
  TRANSACTION_PERIOD,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
  MARKET_TYPE_FILTER,
  MARKET_LIMIT,
  MARKET_OFFSET,
  UPDATE_FILTER_SORT_OPTIONS,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import {
  MAX_FEE_02_PERCENT,
  MARKET_OPEN,
  MARKET_SORT_PARAMS,
  DAY,
  MAX_SPREAD_ALL_SPREADS,
  TEMPLATE_FILTER,
  FILTER_ALL,
  PAGINATION_COUNT,
  DEFAULT_MARKET_OFFSET,
} from 'modules/common/constants';
import { TemplateFilters,
} from '@augurproject/sdk-lite';
import { FilterSortOptions, BaseAction, INVALID_OPTIONS } from 'modules/types';

const DEFAULT_STATE: FilterSortOptions = {
  [MARKET_FILTER]: MARKET_OPEN,
  [MARKET_SORT]: MARKET_SORT_PARAMS.MOST_TRADED,
  [MARKET_MAX_FEES]: MAX_FEE_02_PERCENT,
  [MARKET_MAX_SPREAD]: MAX_SPREAD_ALL_SPREADS,
  [MARKET_SHOW_INVALID]: INVALID_OPTIONS.Hide,
  [MARKET_TYPE_FILTER]: FILTER_ALL,
  [TRANSACTION_PERIOD]: DAY,
  [TEMPLATE_FILTER]: TemplateFilters.all,
  [MARKET_LIMIT]: PAGINATION_COUNT,
  [MARKET_OFFSET]: DEFAULT_MARKET_OFFSET,
};

const KEYS = Object.keys(DEFAULT_STATE);

export default function(
  filterSortOptions: FilterSortOptions = DEFAULT_STATE,
  { type, data }: BaseAction
): FilterSortOptions {
  switch (type) {
    case UPDATE_FILTER_SORT_OPTIONS: {
      const { filterOptions } = data;
      return {
        ...filterSortOptions,
        ...filterOptions
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return filterSortOptions;
  }
}
