export const UPDATE_FILTER_SORT_OPTIONS = "UPDATE_FILTER_SORT_OPTIONS";
export const MARKET_FILTER = "marketFilter";
export const MARKET_SORT = "marketSort";
export const MARKET_MAX_FEES = "maxFee";
export const TRANSACTION_PERIOD = "transactionPeriod";

export function updateFilterSortOptions(optionKey, optionValue) {
  return {
    type: UPDATE_FILTER_SORT_OPTIONS,
    data: {
      optionKey,
      optionValue
    }
  };
}
