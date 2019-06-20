import { createSelector } from "reselect";
import { LoginAccount, MarketInfos } from "modules/types";
import { AppState } from "store";
import { MarketInfo } from "@augurproject/sdk/build/state/getter/Markets";

export const selectAccountNameState = (state: AppState) => state.accountName;
export const selectAccountPositionsState = (state: AppState) =>
  state.accountPositions;
export const selectActiveViewState = (state: AppState) => state.activeView;
export const selectAuthState = (state: AppState) => state.auth;
export const selectBlockchainState = (state: AppState) => state.blockchain;
export const selectCategoriesState = (state: AppState) => state.categories;
export const selectConnectionState = (state: AppState) => state.connection;
export const selectEdgeContextState = (state: AppState) =>
  state.authStatus.edgeContext;
export const selectEdgeLoadingState = (state: AppState) =>
  state.authStatus.edgeLoading;
export const selectEnvState = (state: AppState) => state.env;
export const selectFavoritesState = (state: AppState) => state.favorites;
export const selectGasPriceInfo = (state: AppState) => state.gasPriceInfo;
export const selectReportingWindowStats = (state: AppState) =>
  state.reportingWindowStats;
export const selectIsLogged = (state: AppState) => state.authStatus.isLogged;
export const selectIsMobile = (state: AppState) => state.appStatus.isMobile;
export const selectIsMobileSmall = (state: AppState) =>
  state.appStatus.isMobileSmall;
export const selectLoginAccountState = (state: AppState): LoginAccount =>
  state.loginAccount;
export const selectLoginAccountTotalsState = (state: AppState) =>
  state.loginAccount.tradingPositionsTotal;
export const selectMarketReportState = (state: AppState) =>
  state.marketReportState;
export const selectMarketsDataState = (state: AppState): MarketInfos => state.marketInfos;
export const selectMarketsFilteredSorted = (state: AppState) =>
  state.marketsFilteredSorted;
export const selectModal = (state: AppState) => state.modal;
export const selectNewMarketState = (state: AppState) => state.newMarket;
export const selectAlertsState = (state: AppState) => state.alerts;
export const selectReadNotificationState = (state: AppState) =>
  state.readNotifications;
export const selectPendingOrdersState = (state: AppState) => state.pendingOrders;
export const selectPendingQueueState = (state: AppState) => state.pendingQueue;
export const selectOrderBooksState = (state: AppState) => state.orderBooks;
export const selectOrderCancellationState = (state: AppState) =>
  state.orderCancellation;
export const selectAllOrders = (state: AppState) => state.allOrders;
export const selectOutcomesDataState = (state: AppState) => state.outcomesData;
export const selectMarketTradingHistoryState = (state: AppState) =>
  state.marketTradingHistory;
export const selectReportsState = (state: AppState) => state.reports;
export const selectSelectedMarketsSubsetState = (state: AppState) =>
  state.selectedMarketsSubset;
export const selectSidebarStatus = (state: AppState) => state.sidebarStatus;
export const selectSmallestPositionsState = (state: AppState) =>
  state.smallestPositions;
export const selectUniverseState = (state: AppState) => state.universe;
export const selectUrlState = (state: AppState) => state.url;
export const selectPendingLiquidityOrders = (state: AppState) =>
  state.pendingLiquidityOrders;
export const selectAccountShareBalance = (state: AppState) =>
  state.accountShareBalances;
export const selectFilledOrders = (state: AppState) => state.filledOrders;

export const selectCurrentTimestamp = createSelector(
  selectBlockchainState,
  (blockchain) => blockchain.currentAugurTimestamp * 1000,
);

export const selectCurrentTimestampInSeconds = createSelector(
  selectBlockchainState,
  (blockchain) => blockchain.currentAugurTimestamp,
);

export const selectUniverseReportingPeriodDurationInSeconds = createSelector(
  selectUniverseState,
  (universe) => universe.reportingPeriodDurationInSeconds,
);

export const selectUniverseReportPeriod = createSelector(
  selectUniverseState,
  (universe) => universe.currentReportingWindowAddress,
);

export const selectLoginAccountAddress = createSelector(
  selectLoginAccountState,
  (loginAccount) => loginAccount.address,
);
