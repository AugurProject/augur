import { createSelector } from 'reselect';
import { LoginAccount, MarketInfos } from 'modules/types';
import { AppState } from 'store';

export const selectAccountPositionsState = (state: AppState) =>
  state.accountPositions;
export const selectBlockchainState = (state: AppState) => state.blockchain;
export const selectGasPriceInfo = (state: AppState) => state.gasPriceInfo;
export const selectReportingWindowStats = (state: AppState) =>
  state.reportingWindowStats;
export const selectLoginAccountState = (state: AppState): LoginAccount =>
  state.loginAccount;
export const selectLoginAccountTotalsState = (state: AppState) =>
  state.loginAccount.tradingPositionsTotal;
export const selectMarketReportState = (state: AppState) =>
  state.marketReportState;
export const selectMarketInfosState = (state: AppState): MarketInfos =>
  state.marketInfos;
export const selectModal = (state: AppState) => state.modal;
export const selectReadNotificationState = (state: AppState) =>
  state.readNotifications;
export const selectPendingOrdersState = (state: AppState) =>
  state.pendingOrders;
export const selectOrderBooksState = (state: AppState) => state.orderBooks;
export const selectOrderCancellationState = (state: AppState) =>
  state.orderCancellation;
export const selectMarketTradingHistoryState = (state: AppState) =>
  state.marketTradingHistory;
export const selectUniverseState = (state: AppState) => state.universe;
export const selectPendingLiquidityOrders = (state: AppState) =>
  state.pendingLiquidityOrders;
export const selectFilledOrders = (state: AppState) => state.filledOrders;
export const selectUserMarketOpenOrders = (state: AppState) => state.userOpenOrders;

export const selectCurrentTimestamp = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentAugurTimestamp * 1000
);

export const selectCurrentTimestampInSeconds = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentAugurTimestamp
);

export const selectLoginAccountAddress = createSelector(
  selectLoginAccountState,
  loginAccount => loginAccount.address
);
