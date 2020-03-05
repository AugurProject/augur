import accountPositions from 'modules/positions/reducers/account-positions';
import appStatus from 'modules/app/reducers/app-status';
import sidebarStatus from 'modules/app/reducers/sidebar-status';
import authStatus from 'modules/auth/reducers/auth-status';
import blockchain from 'modules/app/reducers/blockchain';
import connection from 'modules/app/reducers/connection';
import env from 'modules/app/reducers/env';
import favorites from 'modules/markets/reducers/favorites';
import filterSortOptions from 'modules/filter-sort/reducers/filter-sort-options';
import gasPriceInfo from 'modules/app/reducers/gas-price-info';
import loginAccount from 'modules/auth/reducers/login-account';
import marketTradingHistory from 'modules/markets/reducers/market-trading-history';
import marketInfos from 'modules/markets/reducers/market-infos';
import modal from 'modules/modal/reducers/modal';
import newMarket from 'modules/markets/reducers/new-market';
import alerts from 'modules/alerts/reducers/alerts';
import pendingLiquidityOrders from 'modules/orders/reducers/liquidity-orders';
import analytics from 'modules/app/reducers/analytics';
import universe from 'modules/universe/reducers/universe';
import categoryStats from 'modules/app/reducers/category-stats';
import pendingOrders from 'modules/orders/reducers/pending-orders';
import filledOrders from 'modules/orders/reducers/filled-orders';
import readNotifications from 'modules/notifications/reducers/read-notifications';
import pendingQueue from 'modules/pending-queue/reducers/pending-queue';
import userOpenOrders from 'modules/orders/reducers/open-orders';
import drafts from 'modules/create-market/reducers/drafts';
import marketsList from 'modules/markets-list/reducers/markets-list';
import reportingListState from 'modules/reporting/reducers/reporting-list-state';
import orderBooks from 'modules/orders/reducers/order-books'
import {
  LoginAccount,
  AccountPosition,
  AppStatus,
  AuthStatus,
  Blockchain,
  Connection,
  Favorite,
  FilterSortOptions,
  GasPriceInfo,
  MarketInfos,
  NewMarket,
  Alert,
  Notification,
  LiquidityOrders,
  PendingOrders,
  PendingQueue,
  FilledOrders,
  Universe,
  OpenOrders,
  Drafts,
  MarketsList,
  ReportingListState,
  Analytics,
  OrderBooks
} from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { SDKConfiguration } from '@augurproject/artifacts';

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
    orderBooks
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
}
