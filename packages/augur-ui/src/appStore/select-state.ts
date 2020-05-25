import { createSelector } from 'reselect';
import { LoginAccount, MarketsList, AccountBalances, ReportingListState } from 'modules/types';
import { AppState } from 'appStore';
import { Getters } from '@augurproject/sdk/build';
import { CANCELORDER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import { PendingOrders } from 'modules/app/store/pending-orders';
import { Markets } from 'modules/markets/store/markets';

export const selectAccountPositionsState = (state: AppState) =>
  AppStatus.get().accountPositions;
export const selectLoginAccountState = (state: AppState): LoginAccount =>
AppStatus.get().loginAccount;
export const selectLoginAccountReportingState = (
  state: AppState
): Getters.Accounts.AccountReportingHistory => AppStatus.get().loginAccount.reporting;
export const selectReportingListState = (
  state: AppState
): ReportingListState => Markets.get().reportingListState;
export const selectLoginAccountBalancesState = (
  state: AppState
): AccountBalances => AppStatus.get().loginAccount.balances;
export const selectLoginAccountTotalsState = (state: AppState) => AppStatus.get().loginAccount.tradingPositionsTotal;
export const selectMarketsListsState = (state: AppState): MarketsList =>
  AppStatus.get().marketsList;
export const selectCancelingOrdersState = (state: AppState) =>
  AppStatus.get().pendingQueue[CANCELORDER] || [];
export const selectMarketTradingHistoryState = (state: AppState) =>
  Markets.get().marketTradingHistory;
export const selectPendingLiquidityOrders = (state: AppState) =>
  PendingOrders.get().pendingLiquidityOrders;
export const selectUserMarketOpenOrders = (state: AppState) =>
  AppStatus.get().userOpenOrders;

export const selectLoginAccountAddress = createSelector(
  selectLoginAccountState,
  loginAccount => AppStatus.get().loginAccount.mixedCaseAddress
);
