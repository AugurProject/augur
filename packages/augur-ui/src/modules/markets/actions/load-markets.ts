import {
  FILTER_ALL,
  MARKET_CLOSED,
  MARKET_REPORTING,
  MARKET_SORT_PARAMS,
  MAX_FEE_100_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
  REPORTING_STATE,
  THEMES,
  MODAL_MARKET_NOT_FOUND,
} from 'modules/common/constants';
import * as _ from 'lodash';
import { Getters } from '@augurproject/sdk';
import {
  GetMarketsSortBy,
  MarketReportingState,
  TemplateFilters,
} from '@augurproject/sdk-lite';
import { addUpdateMarketInfos } from 'modules/markets/actions/update-markets-data';
import { LoadReportingMarketsOptions } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { augurSdkLite } from 'services/augursdklite';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from '../store/markets';
import { handleMarketsUpdatedLog } from 'modules/events/actions/log-handlers';
import { getOneWeekInFutureTimestamp } from 'utils/format-date';

export const organizeReportingStates = reportingState => {
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
};

export const loadMarketsByFilter = async (
  filterOptions,
  cb: Function = () => {}
) => {
  // console.log('loadMarketsByFilter called', filterOptions);
  const { universe, isConnected, theme } = AppStatus.get();
  if (!(universe && universe.id)) return { marketInfos: {} };

  // Check to see if SDK is connected first
  // since URL parameters can trigger this action before the SDK is ready
  if (!isConnected) return { marketInfos: {} };

  const augur = augurSdk.get();

  const reportingStates: string[] = organizeReportingStates(
    filterOptions.filter
  );
  const sort = {};
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

  const paginationOffset = filterOptions.offset ? filterOptions.offset - 1 : 0;
  let templateFilter = filterOptions.templateFilter as TemplateFilters;
  if (theme === THEMES.SPORTS) {
    filterOptions.maxFee = MAX_FEE_100_PERCENT;
    filterOptions.includInvalidMarkets = false;
    filterOptions.maxLiquiditySpread = MAX_SPREAD_ALL_SPREADS;
    templateFilter = TemplateFilters.sportsBook;
  }
  let params = {
    universe: universe.id,
    categories: filterOptions.categories,
    search: filterOptions.search ? filterOptions.search : '',
    maxFee: filterOptions.maxFee,
    includeInvalidMarkets: theme === THEMES.SPORTS ? false : filterOptions.includeInvalidMarkets,
    limit: Number(filterOptions.limit),
    offset: paginationOffset * Number(filterOptions.limit),
    reportingStates,
    maxLiquiditySpread: filterOptions.maxLiquiditySpread as Getters.Markets.MaxLiquiditySpread,
    ...sort,
    templateFilter,
    marketTypeFilter: filterOptions.marketTypeFilter,
  };

  // not pass properties at their max value
  if (filterOptions.maxFee === MAX_FEE_100_PERCENT) delete params.maxFee;
  if (filterOptions.maxLiquiditySpread === MAX_SPREAD_ALL_SPREADS)
    delete params.maxLiquiditySpread;
  if (filterOptions.marketTypeFilter === FILTER_ALL)
    delete params.marketTypeFilter;

  const marketList = await augur.getMarkets({ ...params });
  const marketInfos = addUpdateMarketInfos(marketList.markets);

  cb(null, marketList);
  return { marketInfos };
};

export const loadNextWindowDisputingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
) => {
  const params = {
    reportingStates: [MarketReportingState.AwaitingNextWindow],
    ...filterOptions,
  };
  loadReportingMarkets(params, cb);
};

export const loadCurrentlyDisputingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
) => {
  const params = {
    reportingStates: [MarketReportingState.CrowdsourcingDispute],
    ...filterOptions,
  };
  loadReportingMarkets(params, cb);
};

export const loadOpenReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
) => {
  const params = {
    reportingStates: [MarketReportingState.OpenReporting],
    ...filterOptions,
  };
  loadReportingMarkets(params, cb);
};

export const loadUpcomingDesignatedReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
) => {
  const {
    loginAccount: { address: designatedReporter },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const maxEndTime = getOneWeekInFutureTimestamp(currentAugurTimestamp);
  if (!designatedReporter)
    return cb(null, { markets: [], meta: { marketCount: 0 } });

  const params = {
    reportingStates: [MarketReportingState.PreReporting],
    designatedReporter,
    maxEndTime,
    ...filterOptions,
  };
  loadReportingMarkets(params, cb);
};

export const loadDesignatedReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
) => {
  const {
    loginAccount: { address: designatedReporter },
  } = AppStatus.get();
  if (!designatedReporter)
    return cb(null, { markets: [], meta: { marketCount: 0 } });

  const params = {
    reportingStates: [MarketReportingState.DesignatedReporting],
    designatedReporter,
    ...filterOptions,
  };
  loadReportingMarkets(params, cb);
};

const loadReportingMarkets = (
  filterOptions: LoadReportingMarketsOptions,
  cb: Function = () => {}
) => {
  const { universe, isConnected } = AppStatus.get();
  if (!isConnected) return cb(null, []);
  if (!(universe && universe.id)) return cb(null, []);
  let reportingState = null;
  if (filterOptions.reportingStates.length === 1) {
    reportingState = filterOptions.reportingStates[0];
    Markets.actions.updateReportingList(
      reportingState,
      [],
      filterOptions,
      true
    );
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

  Markets.actions.updateReportingList(
    reportingState,
    null,
    filterOptions,
    false,
    getMarkets(reportingState, params, cb)
  );
};

const getMarkets = (reportingState, params, cb) => async () => {
  const augur = augurSdk.get();
  const marketList: Getters.Markets.MarketList = await augur.getMarkets({
    ...params,
  });

  const marketInfos = addUpdateMarketInfos(marketList.markets);
  Markets.actions.updateMarketsData(marketInfos);

  const marketIds = marketList.markets.map(m => m.id);
  if (cb) cb(null, marketList);
  if (reportingState) {
    return {
      marketIds,
    };
  }
};

export const hotLoadMarket = (marketId, history) => {
  console.log('Hot Loading Market', marketId);
  const augurLite = augurSdkLite.get();
  augurLite.hotloadMarket(marketId).then(marketsInfo => {
    if (marketsInfo) {
      handleMarketsUpdatedLog({
        marketsInfo,
      });
    } else {
      AppStatus.actions.setModal({
        type: MODAL_MARKET_NOT_FOUND,
        history,
      });
    }
  });
};
