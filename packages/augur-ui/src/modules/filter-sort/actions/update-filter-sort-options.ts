export const UPDATE_FILTER_SORT_OPTION = 'UPDATE_FILTER_SORT_OPTION';
export const UPDATE_FILTER_SORT_OPTIONS = 'UPDATE_FILTER_SORT_OPTIONS';
export const MARKET_FILTER = 'marketFilter'; // market reporting state filter
export const MARKET_SORT = 'sortBy';
export const MARKET_MAX_FEES = 'maxFee';
export const MARKET_MAX_SPREAD = 'maxLiquiditySpread';
export const MARKET_SHOW_INVALID = 'includeInvalidMarkets';
export const TRANSACTION_PERIOD = 'transactionPeriod';
export const TEMPLATE_FILTER = 'templateFilter';
export const MARKET_TYPE_FILTER = 'marketTypeFilter';
export const MARKET_LIMIT = 'limit';
export const MARKET_OFFSET = 'offset';

export function updateFilterSortOption(
  optionKey: string,
  optionValue: string | boolean
) {
  return {
    type: UPDATE_FILTER_SORT_OPTION,
    data: {
      optionKey,
      optionValue,
    },
  };
}

export interface FilterOption {
  [optionKey: string]: string | boolean | number;
}

export function updateFilterSortOptions(filterOptions: FilterOption[]) {
  return {
    type: UPDATE_FILTER_SORT_OPTIONS,
    data: { filterOptions },
  };
}
