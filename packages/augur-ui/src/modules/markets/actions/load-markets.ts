import { augurSdk } from 'services/augursdk';
import logError from 'utils/log-error';
import {
  MARKET_SORT_PARAMS,
  MARKET_REPORTING,
  MARKET_CLOSED,
  REPORTING_STATE,
} from 'modules/common/constants';
import { NodeStyleCallback } from 'modules/types';
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Action } from 'redux';
import { AppState } from 'store';

// NOTE -- We ONLY load the market ids during this step.
// From here we populate the marketInfos
export const loadAllMarketIds = (
  callback: NodeStyleCallback = logError
):ThunkAction<void, AppState, void, UpdateMarketsAction > => async (
  dispatch,
  getState
) => {
  const augur = augurSdk.get();
  const { universe } = getState();
  if (!(universe && universe.id)) return;
  const marketsArray = await augur.getMarkets({ universe: universe.id });

  callback(null, marketsArray);
};

interface SortOptions {
  sortBy?: string,
  isSortDescending?: boolean,
}

export interface LoadMarketsFilterOptions {
  category: string,
  search: string,
  filter: string,
  sort: string,
  maxFee: string,
  hasOrders: boolean,
}

export const loadMarketsByFilter = (
  filterOptions: LoadMarketsFilterOptions,
  cb: Function = () => {}
):ThunkAction<void, AppState, void, UpdateMarketsAction > => async (
  dispatch,
  getState
) => {
  const augur = augurSdk.get();
  const { universe } = getState();

  if (!(universe && universe.id)) return;

  const filter: REPORTING_STATE[] = [];
  const sort:SortOptions = {};
  switch (filterOptions.sort) {
    case MARKET_SORT_PARAMS.RECENTLY_TRADED: {
      // Sort By Recently Traded:
      sort.sortBy = 'lastTradeTime';
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.END_DATE: {
      // Sort By End Date (soonest first):
      sort.sortBy = 'endTime';
      sort.isSortDescending = false;
      break;
    }
    case MARKET_SORT_PARAMS.CREATION_TIME: {
      // Sort By Creation Date (most recent first):
      sort.sortBy = 'creationBlockNumber';
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.CREATOR_FEE_RATE: {
      // Sort By Fee (lowest first):
      sort.sortBy = 'marketCreatorFeeRate';
      sort.isSortDescending = false;
      break;
    }
    case MARKET_SORT_PARAMS.OPEN_INTEREST: {
      sort.sortBy = 'openInterest';
      sort.isSortDescending = true;
      break;
    }
    default: {
      // Sort By Volume:
      // leave defaults
      break;
    }
  }

  const params = {
    universe: universe.id,
    //category: filterOptions.category,
    // search: filterOptions.search,
    maxFee: filterOptions.maxFee,
    hasOrders: filterOptions.hasOrders,
    ...sort
  };
  switch (filterOptions.filter) {
    case MARKET_REPORTING: {
      // reporting markets only:
      filter.push(
        REPORTING_STATE.DESIGNATED_REPORTING,
        REPORTING_STATE.OPEN_REPORTING,
        REPORTING_STATE.CROWDSOURCING_DISPUTE,
        REPORTING_STATE.AWAITING_NEXT_WINDOW,
        REPORTING_STATE.AWAITING_FORK_MIGRATION,
      );
      break;
    }
    case MARKET_CLOSED: {
      // resolved markets only:
      filter.push(
        REPORTING_STATE.AWAITING_FINALIZATION,
        REPORTING_STATE.FINALIZED,
      );
      break;
    }
    default: {
      // open markets only:
      filter.push(REPORTING_STATE.PRE_REPORTING);
      break;
    }
  }

  const requests = filter.map(filterType =>
    augur.getMarkets({ ...params, reportingState: filterType })
  );
  const nestedMarkets = await Promise.all(requests);
  // flatten, when we upgrade to es2019 we can use nestedMarkets.flat() instead
  const markets = nestedMarkets.reduce((a, b) => a.concat(b), []);

  cb(null, markets);
};
