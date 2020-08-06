import { FormattedNumber } from 'modules/types';

export const IS_MOBILE = 'isMobile';
export const IS_MOBILE_SMALL = 'isMobileSmall';
export const IS_HELP_MENU_OPEN = 'isHelpMenuOpen';
export const UPDATE_APP_STATUS = 'UPDATE_APP_STATUS';
export const ETH_TO_DAI_RATE = 'ethToDaiRate';
export const REP_TO_DAI_RATE = 'repToDaiRate';
export const USDT_TO_DAI_RATE = 'usdtToDaiRate';
export const USDC_TO_DAI_RATE = 'usdcToDaiRate';
export const GSN_ENABLED = 'gsnEnabled';
export const Ox_ENABLED = 'zeroXEnabled';
export const Ox_STATUS = 'zeroXStatus';
export const WALLET_STATUS = 'walletStatus';

export function updateAppStatus(statusKey: string, value: boolean | FormattedNumber | string) {
  return {
    type: UPDATE_APP_STATUS,
    data: {
      statusKey,
      value,
    },
  };
}

