import { THEMES, ODDS_TYPE } from 'modules/common/constants';

export const THEME = 'theme';
export const ODDS = 'oddsType';
export const IS_ODDS_MENU_OPEN = 'isOddsMenuOpen';
export const IS_HELP_MENU_OPEN = 'isHelpMenuOpen';
export const IS_CONNECTION_TRAY_OPEN = 'isConnectionTrayOpen';

export const DEFAULT_APP_STATUS = {
  [THEME]: THEMES.TRADING,
  [ODDS]: ODDS_TYPE.DECIMAL,
  [IS_HELP_MENU_OPEN]: false,
  [IS_CONNECTION_TRAY_OPEN]: false,
  [IS_ODDS_MENU_OPEN]: false,
};

export const APP_STATUS_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_ODDS: 'SET_ODDS',
  SET_IS_ODDS_MENU_OPEN: 'SET_IS_ODDS_MENU_OPEN',
  SET_IS_HELP_MENU_OPEN: 'SET_IS_HELP_MENU_OPEN',
  SET_IS_CONNECTION_TRAY_OPEN: 'SET_IS_CONNECTION_TRAY_OPEN',
  CLOSE_APP_MENUS: 'CLOSE_APP_MENUS',
};

export const STUBBED_APP_STATUS_ACTIONS = {
  setTheme: theme => {},
  setOdds: odds => {},
  setIsOddsMenuOpen: isOpen => {},
  setIsHelpMenuOpen: isOpen => {},
  setIsConnectionTrayOpen: isOpen => {},
  closeAppMenus: () => {},
};