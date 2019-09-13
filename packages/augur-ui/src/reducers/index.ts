import accountPositions from "modules/positions/reducers/account-positions";
import appStatus from "modules/app/reducers/app-status";
import sidebarStatus from "modules/app/reducers/sidebar-status";
import authStatus from "modules/auth/reducers/auth-status";
import blockchain from "modules/app/reducers/blockchain";
import connection from "modules/app/reducers/connection";
import env from "modules/app/reducers/env";
import favorites from "modules/markets/reducers/favorites";
import filterSortOptions from "modules/filter-sort/reducers/filter-sort-options";
import gasPriceInfo from "modules/app/reducers/gas-price-info";
import loginAccount from "modules/auth/reducers/login-account";
import marketTradingHistory from "modules/markets/reducers/market-trading-history";
import marketInfos from "modules/markets/reducers/market-infos";
import modal from "modules/modal/reducers/modal";
import newMarket from "modules/markets/reducers/new-market";
import alerts from "modules/alerts/reducers/alerts";
import orderBooks from "modules/orders/reducers/order-books";
import orderCancellation from "modules/orders/reducers/order-cancellation";
import pendingLiquidityOrders from "modules/orders/reducers/liquidity-orders";
import disputeWindowStats from "modules/reports/reducers/reporting-window-stats";
import universe from "modules/universe/reducers/universe";
import versions from "modules/app/reducers/versions";
import pendingOrders from "modules/orders/reducers/pending-orders";
import filledOrders from "modules/orders/reducers/filled-orders";
import readNotifications from "modules/notifications/reducers/read-notifications";
import pendingQueue from "modules/pending-queue/reducers/pending-queue";
import userOpenOrders from "modules/orders/reducers/open-orders";
import drafts from "modules/create-market/reducers/drafts";
import marketsList from "modules/markets-list/reducers/markets-list";
import {
  LoginAccount,
  AccountPosition,
  AppStatus,
  AuthStatus,
  Blockchain,
  Connection,
  EnvObject,
  Favorite,
  FilterSortOptions,
  GasPriceInfo,
  MarketInfos,
  NewMarket,
  Alert,
  Notification,
  OrderBooks,
  OrderCancellations,
  LiquidityOrders,
  PendingOrders,
  PendingQueue,
  FilledOrders,
  ReportingWindowStats,
  Universe,
  Versions,
  OpenOrders,
  MarketTradingHistoryState,
  Drafts,
  MarketsList,
} from "modules/types";

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
    orderBooks,
    orderCancellation,
    pendingLiquidityOrders,
    pendingOrders,
    pendingQueue,
    filledOrders,
    disputeWindowStats,
    sidebarStatus,
    universe,
    versions,
    userOpenOrders,
    drafts,
    marketsList,
  };
}

// TODO: couldn't use concreat type form `createReducer` so hardcoding structure here
// keeping with reducers for easier maintenance.
export interface AppStateInterface {
  accountPositions: AccountPosition;
  alerts: Array<Alert>;
  appStatus: AppStatus;
  authStatus: AuthStatus;
  blockchain: Blockchain;
  connection: Connection;
  env: EnvObject;
  favorites: Favorite;
  filterSortOptions: FilterSortOptions;
  gasPriceInfo: GasPriceInfo;
  loginAccount: LoginAccount;
  marketTradingHistory: MarketTradingHistoryState;
  marketInfos: MarketInfos;
  modal: any;
  newMarket: NewMarket;
  readNotifications: Array<Notification>;
  orderBooks: OrderBooks;
  orderCancellation: OrderCancellations;
  pendingLiquidityOrders: LiquidityOrders;
  pendingOrders: PendingOrders;
  pendingQueue: PendingQueue;
  filledOrders: FilledOrders;
  disputeWindowStats: ReportingWindowStats;
  sidebarStatus: any;
  universe: Universe;
  versions: Versions;
  userOpenOrders: OpenOrders;
  drafts: Drafts;
  marketsList: MarketsList;
}
