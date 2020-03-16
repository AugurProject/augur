import { BigNumber } from 'utils/create-big-number';

export const IS_MOBILE = 'isMobile';
export const IS_MOBILE_SMALL = 'isMobileSmall';
export const IS_HELP_MENU_OPEN = 'isHelpMenuOpen';
export const UPDATE_APP_STATUS = 'UPDATE_APP_STATUS';
export const ETH_TO_DAI_RATE = 'ethToDaiRate';
export const GSN_ENABLED = 'gsnEnabled';
export const Ox_ENABLED = 'zeroXEnabled';
export const GNOSIS_STATUS = 'gnosisStatus';
export const THEME = 'theme';
export const WALLET_STATUS = 'walletStatus';

export function updateAppStatus(statusKey: string, value: boolean | BigNumber | string) {
  return {
    type: UPDATE_APP_STATUS,
    data: {
      statusKey,
      value,
    },
  };
}

const setHTMLTheme = (theme) => document.documentElement.setAttribute(THEME, theme);
export const getTheme = () => document.documentElement.getAttribute(THEME);

export function setTheme(theme: string) {
  const currentTheme = getTheme();
  if (theme !== currentTheme) {
    setHTMLTheme(theme);
  }
  return {
    type: UPDATE_APP_STATUS,
    data: {
      statusKey: THEME,
      value: theme
    }
  };
}