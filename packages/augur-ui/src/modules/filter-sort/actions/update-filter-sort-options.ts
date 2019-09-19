export const UPDATE_FILTER_SORT_OPTIONS = 'UPDATE_FILTER_SORT_OPTIONS';
export const MARKET_FILTER = 'marketFilter';
export const MARKET_SORT = 'marketSort';
export const MARKET_MAX_FEES = 'maxFee';
export const MARKET_MAX_SPREAD = 'maxLiquiditySpread';
export const MARKET_SHOW_INVALID = 'includeInvalidMarkets';
export const TRANSACTION_PERIOD = 'transactionPeriod';

export function updateFilterSortOptions(
  optionKey: string,
  optionValue: string | boolean
) {
  return {
    type: UPDATE_FILTER_SORT_OPTIONS,
    data: {
      optionKey,
      optionValue,
    },
  };
}
