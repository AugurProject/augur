import { DEFAULT_MARKET_VIEW_SETTINGS, SETTINGS_SLIPPAGE } from '../constants';
import { AppStatusState, ParaDeploys } from '../types';

// @ts-ignore
export const PARA_CONFIG: ParaDeploys =
  ((process.env.CONFIGURATION as unknown) as ParaDeploys) || {};

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

export const NETWORK_BLOCK_REFRESH_TIME = {
  1: 15000,
  3: 5000,
  4: 5000,
  5: 5000,
  42: 5000,
};