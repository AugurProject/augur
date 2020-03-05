import { BigNumber } from 'utils/create-big-number';

export const IS_MOBILE = 'isMobile';
export const IS_MOBILE_SMALL = 'isMobileSmall';
export const IS_HELP_MENU_OPEN = 'isHelpMenuOpen';
export const UPDATE_APP_STATUS = 'UPDATE_APP_STATUS';
export const ETH_TO_DAI_RATE = 'ethToDaiRate';
export const GNOSIS_ENABLED = 'gnosisEnabled';
export const Ox_ENABLED = 'zeroXEnabled';
export const GNOSIS_STATUS = 'gnosisStatus';
export const THEME = 'theme';

export function updateAppStatus(statusKey: string, value: boolean | BigNumber | string) {
  return {
    type: UPDATE_APP_STATUS,
    data: {
      statusKey,
      value,
    },
  };
}

export const getTheme = () => document.documentElement.getAttribute(THEME);
// this should only get set using setTheme so don't export it.
const setHTMLTheme = (theme) => document.documentElement.setAttribute(THEME, theme);

export function setTheme(theme: string) {
  const currentTheme = getTheme();
  if (theme !== currentTheme) {
    setHTMLTheme(theme);
  }g
  return {
    type: UPDATE_APP_STATUS,
    data: {
      statusKey: THEME,
      value: theme
    }
  };
}