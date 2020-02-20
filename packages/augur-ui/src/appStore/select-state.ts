import { createSelector } from 'reselect';
import { LoginAccount, MarketInfos, MarketsList, AccountBalances, ReportingListState } from 'modules/types';
import { AppState } from 'appStore';
import { Getters } from '@augurproject/sdk/build';

export const selectAccountPositionsState = (state: AppState) =>
  state.accountPositions;
export const selectBlockchainState = (state: AppState) => state.blockchain;
export const selectGasPriceInfo = (state: AppState) => state.gasPriceInfo;
export const selectAuthStatus = (state: AppState) => state.authStatus;
export const selectDisputeWindowStats = (state: AppState) =>
  state.universe.disputeWindow;
export const selectLoginAccountState = (state: AppState): LoginAccount =>
  state.loginAccount;
export const selectLoginAccountReportingState = (
  state: AppState
): Getters.Accounts.AccountReportingHistory => state.loginAccount.reporting;
export const selectReportingListState = (
  state: AppState
): ReportingListState => state.reportingListState;
export const selectLoginAccountBalancesState = (
  state: AppState
): AccountBalances => state.loginAccount.balances;
export const selectLoginAccountTotalsState = (state: AppState) =>
  state.loginAccount.tradingPositionsTotal;
export const selectMarketInfosState = (state: AppState): MarketInfos =>
  state.marketInfos;
export const selectMarketsListsState = (state: AppState): MarketsList =>
  state.marketsList;
export const selectModal = (state: AppState) => state.modal;
export const selectReadNotificationState = (state: AppState) =>
  state.readNotifications;
export const selectPendingOrdersState = (state: AppState) =>
  state.pendingOrders;
export const selectOrderCancellationState = (state: AppState) =>
  state.orderCancellation;
export const selectMarketTradingHistoryState = (state: AppState) =>
  state.marketTradingHistory;
export const selectUniverseState = (state: AppState) => state.universe;
export const selectUniverseForkingState = (state: AppState) => state.universe.forkingInfo;
export const selectPendingLiquidityOrders = (state: AppState) =>
  state.pendingLiquidityOrders;
export const selectFilledOrders = (state: AppState) => state.filledOrders;
export const selectUserMarketOpenOrders = (state: AppState) =>
  state.userOpenOrders;
export const selectPendingQueue = (state: AppState) => state.pendingQueue;

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
  loginAccount => loginAccount.mixedCaseAddress
);
