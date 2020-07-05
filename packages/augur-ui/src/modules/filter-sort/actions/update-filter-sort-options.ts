import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { updateLoginAccount } from 'modules/account/actions/login-account';

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

const SAVE_TO_SETTINGS = [
  MARKET_FILTER,
  MARKET_SORT,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
  TRANSACTION_PERIOD,
  TEMPLATE_FILTER,
];

export interface FilterOption {
  [optionKey: string]: string | boolean | number;
}

export const updateFilterSortOptionsSettings = (
  filterOptions: FilterOption
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  let newSettings = getState().loginAccount.settings;
  Object.keys(filterOptions).forEach(name => {
    if (SAVE_TO_SETTINGS.includes(name))
      newSettings = Object.assign({}, newSettings, {
        [name]: filterOptions[name],
      });
  });
  dispatch(updateLoginAccount({ settings: newSettings }));
  dispatch({
    type: UPDATE_FILTER_SORT_OPTIONS,
    data: { filterOptions },
  });
};
