import { DEFAULT_MARKET_VIEW_SETTINGS, SETTINGS_SLIPPAGE } from '../constants';
import { AppStatusState, GraphDataState, UserState, ParaDeploys } from '../types';

// @ts-ignore
export const PARA_CONFIG: ParaDeploys =
  ((process.env.CONFIGURATION as unknown) as ParaDeploys) || {};

export const STUBBED_GRAPH_DATA_ACTIONS = {
  updateGraphHeartbeat: (processed, blocknumber, errors) => {},
};

export const DEFAULT_GRAPH_DATA_STATE: GraphDataState = {
  ammExchanges: {},
  blocknumber: null,
  cashes: {},
  errors: null,
  markets: {},
  gasPrices: {}
};

export const GRAPH_DATA_KEYS = {
  AMM_EXCHANGES: 'ammExchanges',
  BLOCKNUMBER: 'blocknumber',
  CASHES: 'cashes',
  ERRORS: 'errors',
  MARKETS: 'markets',
  GAS_PRICES: 'gasPrices'
};

export const GRAPH_DATA_ACTIONS = {
  UPDATE_GRAPH_HEARTBEAT: 'UPDATE_GRAPH_HEARTBEAT',
};

export const STUBBED_USER_ACTIONS = {
  addSeenPositionWarnings: (seenPositionWarnings) => {},
  addTransaction: (transaction) => {},
  finalizeTransaction: (hash) => {},
  removeTransaction: (hash) => {},
  updateLoginAccount: (updateLoginAccount) => {},
  updateSeenPositionWarning: (id, seenPositionWarning, warningType) => {},
  updateTransaction: (hash, updates) => {},
  updateUserBalances: (balances) => {},
  logout: () => {},
};

export const DEFAULT_USER_STATE: UserState = {
  account: null,
  balances: {
    ETH: {
      balance: '0',
      rawBalance: '0',
      usdValue: '0',
    },
    USDC: {
      balance: '0',
      rawBalance: '0',
      usdValue: '0',
    },
    totalAccountValue: '0',
    totalPositionUsd: '0',
    total24hrPositionUsd: '0',
    change24hrPositionUsd: '0',
    availableFundsUsd: '0',
    lpTokens: {},
    marketShares: {},
    claimableWinnings: {},
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
  setIsMobile: (isMobile) => {},
  setSidebar: (sidebarType) => {},
  setShowTradingForm: (showTradingForm) => {},
  updateMarketsViewSettings: (settings) => {},
  updateSettings: (settings, account = null) => {},
  setModal: (modal) => {},
  closeModal: () => {},
  setIsLogged: (account) => {},
};

export const DEFAULT_APP_STATUS_STATE: AppStatusState = {
  isMobile: false,
  sidebarType: null,
  isLogged: false,
  modal: {},
  showTradingForm: false,
  marketsViewSettings: DEFAULT_MARKET_VIEW_SETTINGS,
  settings: {
    slippage: SETTINGS_SLIPPAGE,
    showInvalidMarkets: false,
    showLiquidMarkets: false,
  },
};

export const APP_STATE_KEYS = {
  IS_MOBILE: 'isMobile',
  SIDEBAR_TYPE: 'sidebarType',
  MARKETS_VIEW_SETTINGS: 'marketsViewSettings',
  SETTINGS: 'settings',
  MODAL: 'modal',
  IS_LOGGED: 'isLogged',
  SHOW_TRADING_FORM: 'showTradingForm',
};

export const APP_STATUS_ACTIONS = {
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  SET_SIDEBAR: 'SET_SIDEBAR',
  SET_SHOW_TRADING_FORM: 'SET_SHOW_TRADING_FORM',
  UPDATE_MARKETS_VIEW_SETTINGS: 'UPDATE_MARKETS_VIEW_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_MODAL: 'SET_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  SET_IS_LOGGED: 'SET_IS_LOGGED',
};

export const MOCK_APP_STATUS_STATE = {
  ...DEFAULT_APP_STATUS_STATE,
};

export const NETWORK_NAMES = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan'
};
