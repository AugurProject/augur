import type { Getters } from '@augurproject/sdk';
import { GetMarketsSortBy, MarketReportingState } from '@augurproject/sdk-lite';
import { AppState } from 'appStore';
import {
  FILTER_ALL,
  MARKET_CLOSED,
  MARKET_REPORTING,
  MARKET_SORT_PARAMS,
  MAX_FEE_100_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
  REPORTING_STATE,
} from 'modules/common/constants';
import {
  addUpdateMarketInfos,
  UpdateMarketsAction,
} from 'modules/markets/actions/update-markets-data';
import { updateReportingList } from 'modules/reporting/actions/update-reporting-list';
import { LoadReportingMarketsOptions } from 'modules/types';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import { augurSdkLite } from 'services/augursdklite';
import { getOneWeekInFutureTimestamp } from 'utils/format-date';

interface SortOptions {
  sortBy?: GetMarketsSortBy;
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
  templateFilter?: string;
  marketTypeFilter?: string;
}

export const organizeReportingStates = (reportingState) => {
  let reportingStates: string[] = [];
  switch (reportingState) {
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
      reportingStates.push(REPORTING_STATE.AWAITING_FINALIZATION);
      reportingStates.push(REPORTING_STATE.FINALIZED);
      break;
    }
    default: {
      // open markets only:
      reportingStates.push(REPORTING_STATE.PRE_REPORTING);
      break;
    }
  }

  return reportingStates;
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

  const reportingStates: string[] = organizeReportingStates(filterOptions.filter);
  const sort: SortOptions = {};
  switch (filterOptions.sort) {
    case MARKET_SORT_PARAMS.MOST_TRADED: {
      // Sort By Most Traded:
      sort.sortBy = GetMarketsSortBy.numberOfTrades;
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.RECENTLY_TRADED: {
      // Sort By Recently Traded:
      sort.sortBy = GetMarketsSortBy.lastTradedTimestamp;
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.END_DATE: {
      // Sort By End Date (soonest first):
      sort.sortBy = GetMarketsSortBy.endTime;
      sort.isSortDescending = false;
      break;
    }
    case MARKET_SORT_PARAMS.VOLUME: {
      // Highest volume
      sort.sortBy = GetMarketsSortBy.volume;
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.LIQUIDITY: {
      // Highest liquidity
      sort.sortBy = GetMarketsSortBy.liquidity;
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.CREATION_TIME: {
      // Sort By Creation Date (most recent first):
      sort.sortBy = GetMarketsSortBy.timestamp;
      sort.isSortDescending = true;
      break;
    }
    case MARKET_SORT_PARAMS.OPEN_INTEREST: {
      sort.sortBy = GetMarketsSortBy.marketOI;
      sort.isSortDescending = true;
      break;
    }
    default: {
      // Sort By Recently Traded
      sort.sortBy = GetMarketsSortBy.lastTradedTimestamp;
      sort.isSortDescending = true;
      break;
    }
  }

  const paginationOffset = filterOptions.offset ? Number(filterOptions.offset) - 1 : 0;

  let params = {
    universe: universe.id,
    categories: filterOptions.categories,
    search: filterOptions.search ? filterOptions.search : '',
    maxFee: filterOptions.maxFee,
    includeInvalidMarkets: filterOptions.includeInvalidMarkets,
    limit: Number(filterOptions.limit),
    offset: paginationOffset * Number(filterOptions.limit),
    reportingStates,
    maxLiquiditySpread: filterOptions.maxLiquiditySpread as Getters.Markets.MaxLiquiditySpread,
    ...sort,
    templateFilter: filterOptions.templateFilter as Getters.Markets.TemplateFilters,
    marketTypeFilter: filterOptions.marketTypeFilter,
  };

  // not pass properties at their max value
  if (filterOptions.maxFee === MAX_FEE_100_PERCENT) delete params.maxFee;
  if (filterOptions.maxLiquiditySpread === MAX_SPREAD_ALL_SPREADS)
    delete params.maxLiquiditySpread;
  if (filterOptions.marketTypeFilter === FILTER_ALL) delete params.marketTypeFilter;

  const marketList = await augur.getMarkets({ ...params });
  dispatch(addUpdateMarketInfos(marketList.markets));
  cb(null, marketList);
};

export const loadNextWindowDisputingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, Action> => async (
  dispatch,
  getState
) => {
  const params = {
    reportingStates: [MarketReportingState.AwaitingNextWindow],
    ...filterOptions,
  };
  dispatch(loadReportingMarkets(params, cb));
};

export const loadCurrentlyDisputingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, Action> => async (
  dispatch,
  getState
) => {
  const params = {
    reportingStates: [MarketReportingState.CrowdsourcingDispute],
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
    reportingStates: [MarketReportingState.OpenReporting],
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
    reportingStates: [MarketReportingState.PreReporting],
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
    reportingStates: [MarketReportingState.DesignatedReporting],
    designatedReporter,
    ...filterOptions,
  };
  dispatch(loadReportingMarkets(params, cb));
};

const loadReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, Action> => async (
  dispatch,
  getState
) => {
  const { universe, connection } = getState();
  if (!connection.isConnected) return cb(null, []);
  if (!(universe && universe.id)) return cb(null, []);
  let reportingState = null;
  if (filterOptions.reportingStates.length === 1) {
    reportingState = filterOptions.reportingStates[0];
    dispatch(updateReportingList(reportingState, [], filterOptions, true));
  }
  const params = {
    sortBy: GetMarketsSortBy.endTime,
    universe: universe.id,
    includeWarpSyncMarkets: true,
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
  const marketList: Getters.Markets.MarketList = await augur.getMarkets({
    ...params,
  });
  dispatch(addUpdateMarketInfos(marketList.markets));
  if (reportingState) {
    const marketIds = marketList.markets.map(m => m.id);
    dispatch(updateReportingList(reportingState, marketIds, filterOptions, false));
  }
  if (cb) cb(null, marketList);
};

const hotLoadMarket = marketId => {
  console.log('Hot Loading Market', marketId);
  const augurLite = augurSdkLite.get();
  return augurLite.hotloadMarket(marketId);
};

export const hotloadMarket = (marketId) => {
  return hotLoadMarket(marketId);
}
