import { createSelector } from "reselect";

export const selectAccountDisputes = state => state.accountDisputes;
export const selectAccountNameState = state => state.accountName;
export const selectAccountPositionsState = state => state.accountPositions;
export const selectActiveViewState = state => state.activeView;
export const selectAuthState = state => state.auth;
export const selectBlockchainState = state => state.blockchain;
export const selectCategoriesState = state => state.categories;
export const selectConnectionState = state => state.connection;
export const selectDisputeCrowdsourcerTokens = state =>
  state.disputeCrowdsourcerTokens;
export const selectEdgeContextState = state => state.authStatus.edgeContext;
export const selectEdgeLoadingState = state => state.authStatus.edgeLoading;
export const selectEnvState = state => state.env;
export const selectFavoritesState = state => state.favorites;
export const selectGasPriceInfo = state => state.gasPriceInfo;
export const selectReportingWindowStats = state => state.reportingWindowStats;
export const selectInitialReporters = state => state.initialReporters;
export const selectIsLogged = state => state.authStatus.isLogged;
export const selectIsMobile = state => state.appStatus.isMobile;
export const selectIsAnimating = state => state.appStatus.isAnimating;
export const selectIsMobileSmall = state => state.appStatus.isMobileSmall;
export const selectLoginAccountState = state => state.loginAccount;
export const selectLoginAccountTotalsState = state =>
  state.loginAccount.tradingPositionsTotal;
export const selectMarketCreatorFeesState = state => state.marketCreatorFees;
export const selectMarketReportState = state => state.marketReportState;
export const selectMarketsDataState = state => state.marketsData;
export const selectMarketsFilteredSorted = state => state.marketsFilteredSorted;
export const selectModal = state => state.modal;
export const selectNewMarketState = state => state.newMarket;
export const selectAlertsState = state => state.alerts;
export const selectReadNotificationState = state => state.readNotifications;
export const selectPendingOrdersState = state => state.pendingOrders;
export const selectPendingQueueState = state => state.pendingQueue;
export const selectOrphanOrders = state => state.orphanedOrders;
export const selectOrderBooksState = state => state.orderBooks;
export const selectOrderCancellationState = state => state.orderCancellation;
export const selectAllOrders = state => state.allOrders;
export const selectOutcomesDataState = state => state.outcomesData;
export const selectParticipationTokens = state => state.participationTokens;
export const selectMarketTradingHistoryState = state =>
  state.marketTradingHistory;
export const selectReportsState = state => state.reports;
export const selectScalarMarketsShareDenominationState = state =>
  state.scalarMarketsShareDenomination;
export const selectSelectedMarketIDState = state => state.selectedMarketId;
export const selectSelectedMarketsSubsetState = state =>
  state.selectedMarketsSubset;
export const selectSidebarStatus = state => state.sidebarStatus;
export const selectSmallestPositionsState = state => state.smallestPositions;
export const selectUniverseState = state => state.universe;
export const selectUrlState = state => state.url;
export const selectPendingLiquidityOrders = state =>
  state.pendingLiquidityOrders;
export const selectAccountShareBalance = state => state.accountShareBalances;
export const selectFilledOrders = state => state.filledOrders;

export const selectCurrentTimestamp = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentAugurTimestamp * 1000
);

export const selectCurrentTimestampInSeconds = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentAugurTimestamp
);

export const selectBlockchainCurrentBlockTimestamp = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentBlockTimestamp
);

export const selectUniverseReportingPeriodDurationInSeconds = createSelector(
  selectUniverseState,
  universe => universe.reportingPeriodDurationInSeconds
);

export const selectUniverseReportPeriod = createSelector(
  selectUniverseState,
  universe => universe.currentReportingWindowAddress
);

export const selectLoginAccountAddress = createSelector(
  selectLoginAccountState,
  loginAccount => loginAccount.address
);
