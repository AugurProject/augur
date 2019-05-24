import { createSelector } from "reselect";

export const selectAccountPositionsState = state => state.accountPositions;
export const selectBlockchainState = state => state.blockchain;
export const selectGasPriceInfo = state => state.gasPriceInfo;
export const selectReportingWindowStats = state => state.reportingWindowStats;
export const selectLoginAccountState = state => state.loginAccount;
export const selectLoginAccountTotalsState = state =>
  state.loginAccount.tradingPositionsTotal;
export const selectMarketReportState = state => state.marketReportState;
export const selectMarketsDataState = state => state.marketsData;
export const selectReadNotificationState = state => state.readNotifications;
export const selectPendingOrdersState = state => state.pendingOrders;
export const selectOrderBooksState = state => state.orderBooks;
export const selectOrderCancellationState = state => state.orderCancellation;
export const selectOutcomesDataState = state => state.outcomesData;
export const selectMarketTradingHistoryState = state =>
  state.marketTradingHistory;
export const selectReportsState = state => state.reports;
export const selectSelectedMarketsSubsetState = state =>
  state.selectedMarketsSubset;
export const selectSidebarStatus = state => state.sidebarStatus;
export const selectUniverseState = state => state.universe;
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
