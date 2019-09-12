import { augurSdk } from 'services/augursdk';
import {
  MARKET_SORT_PARAMS,
  MARKET_REPORTING,
  MARKET_CLOSED,
  REPORTING_STATE,
  MAX_SPREAD_ALL_SPREADS,
} from 'modules/common/constants';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'store';
import { Getters } from '@augurproject/sdk';
import { UpdateMarketsAction, addUpdateMarketInfos } from 'modules/markets/actions//update-markets-data';
import { getOneWeekInFutureTimestamp } from 'utils/format-date';

interface SortOptions {
  sortBy?: Getters.Markets.GetMarketsSortBy;
  isSortDescending?: boolean;
}

export interface LoadMarketsFilterOptions {
  categories: string[];
  search: string;
  filter: string;
  sort: string;
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: boolean;
  limit: number;
  offset: number;
}

export const loadMarketsByFilter = (
  filterOptions: LoadMarketsFilterOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, UpdateMarketsAction> => async (
  dispatch,
  getState
) => {
  const { universe, connection } = getState();
  if (!(universe && universe.id)) return;

  // Check to see if SDK is connected first
  // since URL parameters can trigger this action before the SDK is ready
  if (!connection.isConnected) return;

  const augur = augurSdk.get();

  const reportingStates: string[] = [];
  const sort: SortOptions = {};
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
    case MARKET_SORT_PARAMS.VOLUME: {
      // Highest volume
      sort.sortBy = Getters.Markets.GetMarketsSortBy.volume;
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.LIQUIDITY: {
      // Highest liquidity
      sort.sortBy = Getters.Markets.GetMarketsSortBy.liquidity;
      sort.isSortDescending = true;
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
      // Sort By Recently Traded
      sort.sortBy = Getters.Markets.GetMarketsSortBy.lastTradedTimestamp;
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
        REPORTING_STATE.AWAITING_FORK_MIGRATION
      );
      break;
    }
    case MARKET_CLOSED: {
      // resolved markets only:
      reportingStates.push(REPORTING_STATE.FINALIZED);
      break;
    }
    default: {
      // open markets only:
      reportingStates.push(REPORTING_STATE.PRE_REPORTING);
      break;
    }
  }

  const paginationOffset = filterOptions.offset ? filterOptions.offset - 1 : 0;

  let params = {
    universe: universe.id,
    categories: filterOptions.categories,
    search: filterOptions.search ? filterOptions.search : '',
    maxFee: filterOptions.maxFee,
    includeInvalidMarkets: filterOptions.includeInvalidMarkets,
    limit: filterOptions.limit,
    offset: paginationOffset * filterOptions.limit,
    reportingStates,
    maxLiquiditySpread: filterOptions.maxLiquiditySpread,
    ...sort,
  };

  const marketList = await augur.getMarkets({ ...params });
  dispatch(addUpdateMarketInfos(marketList.markets));
  cb(null, marketList);
};

export interface LoadReportingMarketsOptions {
  limit: number;
  offset: number;
  userPortfolioAddress?: string;
  sortByRepAmount?: boolean;
  sortByDisputeRounds?: boolean;
  search?: string;
}

export const loadNextWindowDisputingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, UpdateMarketsAction> => async (
  dispatch,
  getState
) => {
  const params = {
    sortBy: Getters.Markets.GetMarketsSortBy.endTime,
    reportingStates: [Getters.Markets.MarketReportingState.AwaitingNextWindow],
    ...filterOptions,
  };
  dispatch(loadReportingMarkets(params, cb));
};

export const loadCurrentlyDisputingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, UpdateMarketsAction> => async (
  dispatch,
  getState
) => {
  const params = {
    sortBy: Getters.Markets.GetMarketsSortBy.endTime,
    reportingStates: [
      Getters.Markets.MarketReportingState.CrowdsourcingDispute,
    ],
    ...filterOptions,
  };
  dispatch(loadReportingMarkets(params, cb));
};

export const loadOpenReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, UpdateMarketsAction> => async (
  dispatch,
  getState
) => {
  const params = {
    sortBy: Getters.Markets.GetMarketsSortBy.endTime,
    reportingStates: [Getters.Markets.MarketReportingState.OpenReporting],
    ...filterOptions,
  };
  dispatch(loadReportingMarkets(params, cb));
};

export const loadUpcomingDesignatedReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, UpdateMarketsAction> => async (
  dispatch,
  getState
) => {
  const { blockchain, loginAccount } = getState();
  const maxEndTime = getOneWeekInFutureTimestamp(
    blockchain.currentAugurTimestamp
  );
  const designatedReporter = loginAccount.address;
  if (!designatedReporter)
    return cb(null, { markets: [], meta: { marketCount: 0 } });

  const params = {
    reportingStates: [Getters.Markets.MarketReportingState.PreReporting],
    designatedReporter,
    maxEndTime,
    ...filterOptions,
  };
  dispatch(loadReportingMarkets(params, cb));
};

export const loadDesignatedReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, UpdateMarketsAction> => async (
  dispatch,
  getState
) => {
  const { loginAccount } = getState();
  const designatedReporter = loginAccount.address;
  if (!designatedReporter)
    return cb(null, { markets: [], meta: { marketCount: 0 } });

  const params = {
    reportingStates: [Getters.Markets.MarketReportingState.DesignatedReporting],
    designatedReporter,
    ...filterOptions,
  };
  dispatch(loadReportingMarkets(params, cb));
};

export const loadReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, UpdateMarketsAction> => async (
  dispatch,
  getState
) => {
  const { universe, connection } = getState();
  if (!connection.isConnected) return cb(null, []);
  if (!(universe && universe.id)) return cb(null, []);
  const params = {
    sortBy: Getters.Markets.GetMarketsSortBy.endTime,
    universe: universe.id,
    ...filterOptions,
  };
  // format offset to getters expectations
  if (filterOptions.offset) {
    const paginationOffset = filterOptions.offset
      ? filterOptions.offset - 1
      : 0;
    params.offset = paginationOffset * filterOptions.limit;
  }
  const augur = augurSdk.get();
  const marketList: Getters.Markets.MarketList = await augur.getMarkets({ ...params });
  dispatch(addUpdateMarketInfos(marketList.markets));
  if (cb) cb(null, marketList);
};
