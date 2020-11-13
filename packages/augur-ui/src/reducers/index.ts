import type { SDKConfiguration } from '@augurproject/artifacts';
import type { Getters } from '@augurproject/sdk';
import alerts from 'modules/alerts/reducers/alerts';
import analytics from 'modules/app/reducers/analytics';
import appStatus from 'modules/app/reducers/app-status';
import blockchain from 'modules/app/reducers/blockchain';
import categoryStats from 'modules/app/reducers/category-stats';
import connection from 'modules/app/reducers/connection';
import env from 'modules/app/reducers/env';
import gasPriceInfo from 'modules/app/reducers/gas-price-info';
import sidebarStatus from 'modules/app/reducers/sidebar-status';
import authStatus from 'modules/auth/reducers/auth-status';
import loginAccount from 'modules/auth/reducers/login-account';
import drafts from 'modules/create-market/reducers/drafts';
import filterSortOptions
  from 'modules/filter-sort/reducers/filter-sort-options';
import marketsList from 'modules/markets-list/reducers/markets-list';
import favorites from 'modules/markets/reducers/favorites';
import marketInfos from 'modules/markets/reducers/market-infos';
import marketTradingHistory
  from 'modules/markets/reducers/market-trading-history';
import newMarket from 'modules/markets/reducers/new-market';
import modal from 'modules/modal/reducers/modal';
import readNotifications
  from 'modules/notifications/reducers/read-notifications';
import filledOrders from 'modules/orders/reducers/filled-orders';
import pendingLiquidityOrders from 'modules/orders/reducers/liquidity-orders';
import userOpenOrders from 'modules/orders/reducers/open-orders';
import orderBooks from 'modules/orders/reducers/order-books';
import pendingOrders from 'modules/orders/reducers/pending-orders';
import pendingQueue from 'modules/pending-queue/reducers/pending-queue';
import accountPositions from 'modules/positions/reducers/account-positions';
import accountRawPositions from 'modules/positions/reducers/account-raw-positions';
import reportingListState
  from 'modules/reporting/reducers/reporting-list-state';
import {
  AccountPosition,
  Alert,
  Analytics,
  AppStatus,
  AuthStatus,
  Blockchain,
  Connection,
  Drafts,
  Favorite,
  FilledOrders,
  FilterSortOptions,
  GasPriceInfo,
  LiquidityOrders,
  LoginAccount,
  MarketInfos,
  MarketsList,
  NewMarket,
  Notification,
  OpenOrders,
  OrderBooks,
  PendingOrders,
  PendingQueue,
  ReportingListState,
  Universe,
  accountRawPositions,
} from 'modules/types';
import universe from 'modules/universe/reducers/universe';

export function createReducer() {
  return {
    accountPositions,
    alerts,
    appStatus,
    authStatus,
    blockchain,
    connection,
    env,
    favorites,
    filterSortOptions,
    gasPriceInfo,
    loginAccount,
    marketTradingHistory,
    marketInfos,
    modal,
    newMarket,
    readNotifications,
    pendingLiquidityOrders,
    pendingOrders,
    pendingQueue,
    filledOrders,
    sidebarStatus,
    universe,
    categoryStats,
    userOpenOrders,
    drafts,
    marketsList,
    reportingListState,
    analytics,
    orderBooks,
    accountRawPositions
  };
}

// TODO: couldn't use concreat type form `createReducer` so hardcoding structure here
// keeping with reducers for easier maintenance.
export interface AppStateInterface {
  accountPositions: AccountPosition;
  alerts: Alert[];
  appStatus: AppStatus;
  authStatus: AuthStatus;
  blockchain: Blockchain;
  connection: Connection;
  config: SDKConfiguration;
  favorites: Favorite;
  filterSortOptions: FilterSortOptions;
  gasPriceInfo: GasPriceInfo;
  loginAccount: LoginAccount;
  marketTradingHistory: Getters.Trading.MarketTradingHistory;
  marketInfos: MarketInfos;
  modal: any;
  newMarket: NewMarket;
  readNotifications: Notification[];
  pendingLiquidityOrders: LiquidityOrders;
  pendingOrders: PendingOrders;
  pendingQueue: PendingQueue;
  filledOrders: FilledOrders;
  sidebarStatus: any;
  universe: Universe;
  categoryStats: Getters.Markets.CategoryStats;
  userOpenOrders: OpenOrders;
  drafts: Drafts;
  marketsList: MarketsList;
  reportingListState: ReportingListState;
  analytics: Analytics;
  orderBooks: OrderBooks;
  accountRawPositions: AccountPosition;
}
