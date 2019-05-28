import { createSelector } from "reselect";
import { LoginAccount } from "modules/types";

// @todo Replace with type of root state.
type State = any;

export const selectAccountNameState = (state: State) => state.accountName;
export const selectAccountPositionsState = (state: State) =>
  state.accountPositions;
export const selectActiveViewState = (state: State) => state.activeView;
export const selectAuthState = (state: State) => state.auth;
export const selectBlockchainState = (state: State) => state.blockchain;
export const selectCategoriesState = (state: State) => state.categories;
export const selectConnectionState = (state: State) => state.connection;
export const selectEdgeContextState = (state: State) =>
  state.authStatus.edgeContext;
export const selectEdgeLoadingState = (state: State) =>
  state.authStatus.edgeLoading;
export const selectEnvState = (state: State) => state.env;
export const selectFavoritesState = (state: State) => state.favorites;
export const selectGasPriceInfo = (state: State) => state.gasPriceInfo;
export const selectReportingWindowStats = (state: State) =>
  state.reportingWindowStats;
export const selectIsLogged = (state: State) => state.authStatus.isLogged;
export const selectIsMobile = (state: State) => state.appStatus.isMobile;
export const selectIsMobileSmall = (state: State) =>
  state.appStatus.isMobileSmall;
export const selectLoginAccountState = (state: State): LoginAccount =>
  state.loginAccount;
export const selectLoginAccountTotalsState = (state: State) =>
  state.loginAccount.tradingPositionsTotal;
export const selectMarketReportState = (state: State) =>
  state.marketReportState;
export const selectMarketsDataState = (state: State) => state.marketsData;
export const selectMarketsFilteredSorted = (state: State) =>
  state.marketsFilteredSorted;
export const selectModal = (state: State) => state.modal;
export const selectNewMarketState = (state: State) => state.newMarket;
export const selectAlertsState = (state: State) => state.alerts;
export const selectReadNotificationState = (state: State) =>
  state.readNotifications;
export const selectPendingOrdersState = (state: State) => state.pendingOrders;
export const selectPendingQueueState = (state: State) => state.pendingQueue;
export const selectOrderBooksState = (state: State) => state.orderBooks;
export const selectOrderCancellationState = (state: State) =>
  state.orderCancellation;
export const selectAllOrders = (state: State) => state.allOrders;
export const selectOutcomesDataState = (state: State) => state.outcomesData;
export const selectMarketTradingHistoryState = (state: State) =>
  state.marketTradingHistory;
export const selectReportsState = (state: State) => state.reports;
export const selectSelectedMarketsSubsetState = (state: State) =>
  state.selectedMarketsSubset;
export const selectSidebarStatus = (state: State) => state.sidebarStatus;
export const selectSmallestPositionsState = (state: State) =>
  state.smallestPositions;
export const selectUniverseState = (state: State) => state.universe;
export const selectUrlState = (state: State) => state.url;
export const selectPendingLiquidityOrders = (state: State) =>
  state.pendingLiquidityOrders;
export const selectAccountShareBalance = (state: State) =>
  state.accountShareBalances;
export const selectFilledOrders = (state: State) => state.filledOrders;

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
