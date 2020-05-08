import accountPositions from 'modules/positions/reducers/account-positions';
import favorites from 'modules/markets/reducers/favorites';
import loginAccount from 'modules/auth/reducers/login-account';
import marketTradingHistory from 'modules/markets/reducers/market-trading-history';
import newMarket from 'modules/markets/reducers/new-market';
import alerts from 'modules/alerts/reducers/alerts';
import pendingLiquidityOrders from 'modules/orders/reducers/liquidity-orders';
import analytics from 'modules/app/reducers/analytics';
import pendingOrders from 'modules/orders/reducers/pending-orders';
import filledOrders from 'modules/orders/reducers/filled-orders';
import readNotifications from 'modules/notifications/reducers/read-notifications';
import pendingQueue from 'modules/pending-queue/reducers/pending-queue';
import userOpenOrders from 'modules/orders/reducers/open-orders';
import drafts from 'modules/create-market/reducers/drafts';
import marketsList from 'modules/markets-list/reducers/markets-list';
import reportingListState from 'modules/reporting/reducers/reporting-list-state';
import initialized3box from 'modules/global-chat/reducers/initialized-3box'
import {
  LoginAccount,
  AccountPosition,
  Favorite,
  NewMarket,
  Alert,
  Notification,
  LiquidityOrders,
  PendingOrders,
  PendingQueue,
  FilledOrders,
  OpenOrders,
  Drafts,
  MarketsList,
  ReportingListState,
  Analytics,
  Initialized3box
} from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { SDKConfiguration } from '@augurproject/artifacts';

export function createReducer() {
  return {
    accountPositions,
    alerts,
    favorites,
    loginAccount,
    marketTradingHistory,
    newMarket,
    readNotifications,
    pendingLiquidityOrders,
    pendingOrders,
    pendingQueue,
    filledOrders,
    userOpenOrders,
    drafts,
    marketsList,
    reportingListState,
    analytics,
    initialized3box
  };
}

// TODO: couldn't use concreat type form `createReducer` so hardcoding structure here
// keeping with reducers for easier maintenance.
export interface AppStateInterface {
  accountPositions: AccountPosition;
  alerts: Alert[];
  config: SDKConfiguration;
  favorites: Favorite;
  loginAccount: LoginAccount;
  marketTradingHistory: Getters.Trading.MarketTradingHistory;
  newMarket: NewMarket;
  readNotifications: Notification[];
  pendingLiquidityOrders: LiquidityOrders;
  pendingOrders: PendingOrders;
  pendingQueue: PendingQueue;
  filledOrders: FilledOrders;
  userOpenOrders: OpenOrders;
  drafts: Drafts;
  marketsList: MarketsList;
  reportingListState: ReportingListState;
  analytics: Analytics;
  initialized3box: Initialized3box;
}
