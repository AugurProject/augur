// import { DEFAULT_MARKET_VIEW_SETTINGS, SETTINGS_SLIPPAGE } from '../constants';
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
  addTransaction: (transaction) => {},
  finalizeTransaction: (hash) => {},
  removeTransaction: (hash) => {},
  updateLoginAccount: (updateLoginAccount) => {},
  updateSeenPositionWarning: (id, seenPositionWarning, warningType) => {},
  updateTransaction: (hash, updates) => {},
  updateUserBalances: (balances) => {},
  updateApproval: isApproved => {},
  updateMigrated: isMigrated => {},
  updateTxFailed: txFailed => {},
  logout: () => {},
};

export const DEFAULT_USER_STATE: UserState = {
  account: null,
  balances: {
    rep: '0',
    legacyRep: '0',
  },
  isApproved: null,
  loginAccount: null,
  seenPositionWarnings: {},
  transactions: [],
  txFailed: false,
  isMigrated: false,
};

export const USER_KEYS = {
  ACCOUNT: 'account',
  BALANCES: 'balances',
  LOGIN_ACCOUNT: 'loginAccount',
  SEEN_POSITION_WARNINGS: 'seenPositionWarnings',
  TRANSACTIONS: 'transactions',
  IS_APPROVED: 'isApproved',
  TX_FAILED: 'txFailed',
  IS_MIGRATED: 'isMigrated'
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
  UPDATE_APPROVAL: 'UPDATE_APPROVAL',
  LOGOUT: 'LOGOUT',
  UPDATE_MIGRATED: 'UPDATE_MIGRATED',
  UPDATE_TX_FAILED: 'UPDATE_TX_FAILED'
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
  setTimestamp: (timestamp) => {}
};

export const DEFAULT_APP_STATUS_STATE: AppStatusState = {
  isMobile: false,
  isLogged: false,
  timestamp: 0,
  modal: {}
};

export const APP_STATE_KEYS = {
  IS_MOBILE: 'isMobile',
  MODAL: 'modal',
  IS_LOGGED: 'isLogged',
  TIMESTAMP: 'timestamp',
};

export const APP_STATUS_ACTIONS = {
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  SET_MODAL: 'SET_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  SET_IS_LOGGED: 'SET_IS_LOGGED',
  SET_TIMESTAMP: 'SET_TIMESTAMP'
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

export const NETWORK_BLOCK_REFRESH_TIME = {
  1: 15000,
  3: 5000,
  4: 5000,
  5: 5000,
  42: 5000,
};

// transaction types
export const MIGRATE = 'MIGRATE';
export const APPROVE = 'APPROVE';