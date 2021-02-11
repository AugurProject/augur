import {
  DEFAULT_MARKET_VIEW_SETTINGS,
  SETTINGS_SLIPPAGE,
} from '../constants';
import { AppStatusState, GraphDataState, UserState } from '../types';

export const STUBBED_GRAPH_DATA_ACTIONS = {
  updateGraphHeartbeat: (processed, blocknumber, errors) => {},
};

export const DEFAULT_GRAPH_DATA_STATE: GraphDataState = {
  ammExchanges: {},
  blocknumber: null,
  cashes: {},
  errors: null,
  markets: {},
};

export const GRAPH_DATA_KEYS = {
  AMM_EXCHANGES: 'ammExchanges',
  BLOCKNUMBER: 'blocknumber',
  CASHES: 'cashes',
  ERRORS: 'errors',
  MARKETS: 'markets',
};

export const GRAPH_DATA_ACTIONS = {
  UPDATE_GRAPH_HEARTBEAT: 'UPDATE_GRAPH_HEARTBEAT',
};

export const STUBBED_USER_ACTIONS = {
  addSeenPositionWarnings: (seenPositionWarnings) => {},
  addTransaction: transaction => {},
  finalizeTransaction: hash => {},
  removeTransaction: hash => {},
  updateLoginAccount: updateLoginAccount => {},
  updateSeenPositionWarning: (id, seenPositionWarning, warningType) => {},
  updateTransaction: (hash, updates) => {},
  updateUserBalances: balances => {},
  logout: () => {},
};

export const DEFAULT_USER_STATE: UserState = {
  account: null,
  balances: {
    ETH: {
      balance: "0",
      rawBalance: "0",
      usdValue: "0",
    },
    USDC: {
      balance: "0",
      rawBalance: "0",
      usdValue: "0",
    },
    totalAccountValue: "0",
    totalPositionUsd: "0",
    total24hrPositionUsd: "0",
    change24hrPositionUsd: "0",
    availableFundsUsd: "0",
    lpTokens: {},
    marketShares: {},
    claimableWinnings: {}
  },
  loginAccount: null,
  seenPositionWarnings: {},
  transactions: [],
};

export const USER_KEYS = {
  ACCOUNT: 'account',
  BALANCES: 'balances',
  LOGIN_ACCOUNT: 'loginAccount',
  SEEN_POSITION_WARNINGS: 'seenPositionWarnings',
  TRANSACTIONS: 'transactions',
};

export const USER_ACTIONS = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION',
  FINALIZE_TRANSACTION: 'FINALIZE_TRANSACTION',
  UPDATE_SEEN_POSITION_WARNING: 'UPDATE_SEEN_POSITION_WARNING',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  ADD_SEEN_POSITION_WARNINGS: 'ADD_SEEN_POSITION_WARNINGS',
  SET_LOGIN_ACCOUNT: 'SET_LOGIN_ACCOUNT',
  UPDATE_USER_BALANCES: 'UPDATE_USER_BALANCES',
  LOGOUT: 'LOGOUT',
};

export const STUBBED_APP_STATUS_ACTIONS = {
  setIsMobile: isMobile => {},
  setSidebar: sidebarType => {},
  setShowTradingForm: showTradingForm => {},
  updateLoginAccount: updateLoginAccount => {},
  updateMarketsViewSettings: settings => {},
  updateUserBalances: balances => {},
  updateSettings: settings => {},
  updateTransaction: (hash, updates) => {},
  addTransaction: transaction => {},
  removeTransaction: hash => {},
  logout: () => {},
  finalizeTransaction: hash => {},
  setModal: modal => {},
  closeModal: () => {},
  updateSeenPositionWarning: (id, seenPositionWarning, warningType) => {},
  addSeenPositionWarnings: (seenPositionWarnings) => {}
};


export const DEFAULT_APP_STATUS_STATE: AppStatusState = {
  isMobile: false,
  sidebarType: null,
  loginAccount: null,
  isLogged: false,
  modal: {},
  showTradingForm: false,
  transactions: [],
  marketsViewSettings: DEFAULT_MARKET_VIEW_SETTINGS,
  paraConfig: { addresses: {}, paraDeploys: {}},
  userInfo: {
    balances: {
      ETH: {
        balance: "0",
        rawBalance: "0",
        usdValue: "0",
      },
      USDC: {
        balance: "0",
        rawBalance: "0",
        usdValue: "0",
      },
      totalAccountValue: "0",
      totalPositionUsd: "0",
      total24hrPositionUsd: "0",
      change24hrPositionUsd: "0",
      availableFundsUsd: "0",
      lpTokens: {},
      marketShares: {},
      claimableWinnings: {}
    },
  },
  settings: {
    slippage: SETTINGS_SLIPPAGE,
    showInvalidMarkets: false,
    showLiquidMarkets: false,
  },
  seenPositionWarnings: {}
};

export const APP_STATE_KEYS = {
  IS_MOBILE: 'isMobile',
  SIDEBAR_TYPE: 'sidebarType',
  LOGIN_ACCOUNT: 'loginAccount',
  LIQUIDITY: 'liquidity',
  TRANSACTIONS: 'transactions',
  USER_INFO: 'userInfo',
  MARKETS_VIEW_SETTINGS: 'marketsViewSettings',
  PARA_CONFIG: 'paraConfig',
  SETTINGS: 'settings',
  MODAL: 'modal',
  IS_LOGGED: 'isLogged',
  SHOW_TRADING_FORM: 'showTradingForm',
  SEEN_POSITION_WARNINGS: 'seenPositionWarnings'
};

export const APP_STATUS_ACTIONS = {
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  SET_SIDEBAR: 'SET_SIDEBAR',
  SET_SHOW_TRADING_FORM: 'SET_SHOW_TRADING_FORM',
  UPDATE_PROCESSED: 'UPDATE_PROCESSED',
  SET_LOGIN_ACCOUNT: 'SET_LOGIN_ACCOUNT',
  UPDATE_MARKETS_VIEW_SETTINGS: 'UPDATE_MARKETS_VIEW_SETTINGS',
  UPDATE_USER_BALANCES: 'UPDATE_USER_BALANCES',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION',
  UPDATE_BLOCKNUMBER: 'UPDATE_BLOCKNUMBER',
  FINALIZE_TRANSACTION: 'FINALIZE_TRANSACTION',
  SET_MODAL: 'SET_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  LOGOUT: 'LOGOUT',
  SET_IS_LOGGED: 'SET_IS_LOGGED',
  UPDATE_SEEN_POSITION_WARNING: 'UPDATE_SEEN_POSITION_WARNING',
  ADD_SEEN_POSITION_WARNINGS: 'ADD_SEEN_POSITION_WARNINGS'
};

export const MOCK_APP_STATUS_STATE = {
  ...DEFAULT_APP_STATUS_STATE
};
