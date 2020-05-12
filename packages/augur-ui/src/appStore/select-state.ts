import { createSelector } from 'reselect';
import { LoginAccount, MarketsList, AccountBalances, ReportingListState } from 'modules/types';
import { AppState } from 'appStore';
import { Getters } from '@augurproject/sdk/build';
import { CANCELORDER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

export const selectAccountPositionsState = (state: AppState) =>
  state.accountPositions;
export const selectDisputeWindowStats = (state: AppState) =>
  state.universe.disputeWindow;
export const selectLoginAccountState = (state: AppState): LoginAccount =>
AppStatus.get().loginAccount;
export const selectLoginAccountReportingState = (
  state: AppState
): Getters.Accounts.AccountReportingHistory => AppStatus.get().loginAccount.reporting;
export const selectReportingListState = (
  state: AppState
): ReportingListState => state.reportingListState;
export const selectLoginAccountBalancesState = (
  state: AppState
): AccountBalances => AppStatus.get().loginAccount.balances;
export const selectLoginAccountTotalsState = (state: AppState) => AppStatus.get().loginAccount.tradingPositionsTotal;
export const selectMarketsListsState = (state: AppState): MarketsList =>
  state.marketsList;
export const selectCancelingOrdersState = (state: AppState) =>
  AppStatus.get().pendingQueue[CANCELORDER] || [];
export const selectMarketTradingHistoryState = (state: AppState) =>
  state.marketTradingHistory;
export const selectPendingLiquidityOrders = (state: AppState) =>
  state.pendingLiquidityOrders;
export const selectFilledOrders = (state: AppState) => state.filledOrders;
export const selectUserMarketOpenOrders = (state: AppState) =>
  state.userOpenOrders;

export const selectLoginAccountAddress = createSelector(
  selectLoginAccountState,
  loginAccount => AppStatus.get().loginAccount.mixedCaseAddress
);
