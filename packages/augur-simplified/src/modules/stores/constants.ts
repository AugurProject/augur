import { DEFAULT_MARKET_VIEW_SETTINGS, SETTINGS_SLIPPAGE } from '../constants';
import { ParaDeploys } from '../types';

// @ts-ignore
export const PARA_CONFIG: ParaDeploys =
  ((process.env.CONFIGURATION as unknown) as ParaDeploys) || {};

export const STUBBED_SIMPLIFIED_ACTIONS = {
  setSidebar: (sidebarType) => {},
  setShowTradingForm: (showTradingForm) => {},
  updateMarketsViewSettings: (settings) => {},
  updateSettings: (settings, account = null) => {},
};

export const DEFAULT_SIMPLIFIED_STATE = {
  sidebarType: null,
  showTradingForm: false,
  marketsViewSettings: DEFAULT_MARKET_VIEW_SETTINGS,
  settings: {
    slippage: SETTINGS_SLIPPAGE,
    showInvalidMarkets: false,
    showLiquidMarkets: false,
  },
};

export const SIMPLIFIED_STATE_KEYS = {
  SIDEBAR_TYPE: 'sidebarType',
  MARKETS_VIEW_SETTINGS: 'marketsViewSettings',
  SETTINGS: 'settings',
  SHOW_TRADING_FORM: 'showTradingForm',
};

export const SIMPLIFIED_ACTIONS = {
  SET_SIDEBAR: 'SET_SIDEBAR',
  SET_SHOW_TRADING_FORM: 'SET_SHOW_TRADING_FORM',
  UPDATE_MARKETS_VIEW_SETTINGS: 'UPDATE_MARKETS_VIEW_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
};
