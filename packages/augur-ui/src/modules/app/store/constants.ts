import { THEMES, ODDS_TYPE } from 'modules/common/constants';

export const THEME = 'theme';
export const ODDS = 'oddsType';
export const IS_MOBILE = 'isMobile';
export const IS_ODDS_MENU_OPEN = 'isOddsMenuOpen';
export const IS_HELP_MENU_OPEN = 'isHelpMenuOpen';
export const IS_CONNECTION_TRAY_OPEN = 'isConnectionTrayOpen';
export const IS_ALERTS_MENU_OPEN = 'isAlertsMenuOpen';
export const Ox_ENABLED = 'zeroXEnabled';
export const GSN_ENABLED = 'gsnEnabled';
export const ETH_TO_DAI_RATE = 'ethToDaiRate';
export const REP_TO_DAI_RATE = 'repToDaiRate';

export const DEFAULT_APP_STATUS = {
  [THEME]: THEMES.TRADING,
  [ODDS]: ODDS_TYPE.DECIMAL,
  [IS_MOBILE]: false,
  [IS_HELP_MENU_OPEN]: false,
  [IS_CONNECTION_TRAY_OPEN]: false,
  [IS_ODDS_MENU_OPEN]: false,
  [IS_ALERTS_MENU_OPEN]: false,
  [Ox_ENABLED]: false,
  [GSN_ENABLED]: false,
  [ETH_TO_DAI_RATE]: null,
  [REP_TO_DAI_RATE]: null,
};

export const APP_STATUS_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_ODDS: 'SET_ODDS',
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  SET_IS_ODDS_MENU_OPEN: 'SET_IS_ODDS_MENU_OPEN',
  SET_IS_HELP_MENU_OPEN: 'SET_IS_HELP_MENU_OPEN',
  SET_IS_CONNECTION_TRAY_OPEN: 'SET_IS_CONNECTION_TRAY_OPEN',
  SET_IS_ALERTS_MENU_OPEN: 'SET_IS_ALERTS_MENU_OPEN',
  CLOSE_APP_MENUS: 'CLOSE_APP_MENUS',
  SET_Ox_ENABLED: 'SET_Ox_ENABLED',
  SET_GSN_ENABLED: 'SET_GSN_ENABLED',
  SET_ETH_TO_DAI_RATE: 'SET_ETH_TO_DAI_RATE',
  SET_REP_TO_DAI_RATE: 'SET_REP_TO_DAI_RATE',
};

export const STUBBED_APP_STATUS_ACTIONS = {
  setTheme: theme => {},
  setOdds: odds => {},
  setIsOddsMenuOpen: isOpen => {},
  setIsHelpMenuOpen: isOpen => {},
  setIsConnectionTrayOpen: isOpen => {},
  setIsAlertsMenuOpen: isOpen => {},
  closeAppMenus: () => {},
  setIsMobile: isMobile => {},
  setOxEnabled: isOxEnabled => {},
  setGSNEnabled: isGSNEnabled => {},
  setEthToDaiRate: ethToDaiRate => {},
  setRepToDaiRate: repToDaiRate => {},
};