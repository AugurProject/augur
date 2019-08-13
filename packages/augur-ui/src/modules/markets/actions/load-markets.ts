import { augurSdk } from 'services/augursdk';
import logError from 'utils/log-error';
import {
  MARKET_SORT_PARAMS,
  MARKET_REPORTING,
  MARKET_CLOSED,
  REPORTING_STATE,
} from 'modules/common/constants';
import { NodeStyleCallback } from 'modules/types';
import { ThunkAction } from "redux-thunk";
import { AppState } from 'store';
import { Getters } from '@augurproject/sdk';
import { UpdateMarketsAction, updateMarketsData } from './update-markets-data';

interface SortOptions {
  sortBy?: Getters.Markets.GetMarketsSortBy,
  isSortDescending?: boolean,
}

export interface LoadMarketsFilterOptions {
  categories: string[],
  search: string,
  filter: string,
  sort: string,
  maxFee: string,
  maxLiquiditySpread: string,
  includeInvalidMarkets: boolean,
  limit: number,
  offset: number,
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

  const reportingStates: string[] = [];
  const sort:SortOptions = {};
  switch (filterOptions.sort) {
    case MARKET_SORT_PARAMS.RECENTLY_TRADED: {
      // Sort By Recently Traded:
      sort.sortBy = Getters.Markets.GetMarketsSortBy.lastTradedTimestamp;
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.END_DATE: {
      // Sort By End Date (soonest first):
      sort.sortBy = Getters.Markets.GetMarketsSortBy.endTime;
      sort.isSortDescending = false;
      break;
    }
    case MARKET_SORT_PARAMS.CREATION_TIME: {
      // Sort By Creation Date (most recent first):
      sort.sortBy = Getters.Markets.GetMarketsSortBy.timestamp;
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.OPEN_INTEREST: {
      sort.sortBy = Getters.Markets.GetMarketsSortBy.marketOI;
      sort.isSortDescending = true;
      break;
    }
    default: {
      sort.sortBy = Getters.Markets.GetMarketsSortBy.volume;
      sort.isSortDescending = true;
      break;
    }
  }

  switch (filterOptions.filter) {
    case MARKET_REPORTING: {
      // reporting markets only:
      reportingStates.push(
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
      reportingStates.push(
        REPORTING_STATE.FINALIZED,
      );
      break;
    }
    default: {
      // open markets only:
      reportingStates.push(REPORTING_STATE.PRE_REPORTING);
      break;
    }
  }

  const params = {
    universe: universe.id,
    categories: filterOptions.categories,
    // search: filterOptions.search,
    maxFee: filterOptions.maxFee,
    // maxLiquiditySpread: filterOptions.maxLiquiditySpread,
    // includeInvalidMarkets: filterOptions.includeInvalidMarkets,
    // limit: filterOptions.limit,
    // offset: filterOptions.offset,
    reportingStates,
    ...sort
  };

  const markets = await augur.getMarkets({ ...params });
  const marketInfos =  markets.markets.reduce((p, m) => ({...p, [m.id]: m}), {})
  dispatch(updateMarketsData(marketInfos));
  cb(null, markets);
};
