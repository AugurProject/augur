import { BigNumber } from 'utils/create-big-number';

export const IS_MOBILE = 'isMobile';
export const IS_MOBILE_SMALL = 'isMobileSmall';
export const IS_HELP_MENU_OPEN = 'isHelpMenuOpen';
export const UPDATE_APP_STATUS = 'UPDATE_APP_STATUS';
export const ETH_TO_DAI_RATE = 'ethToDaiRate';
export const GNOSIS_ENABLED = 'gnosisEnabled';
export const Ox_ENABLED = 'zeroXEnabled';
export const GNOSIS_STATUS = 'gnosisStatus';

export function updateAppStatus(statusKey: string, value: boolean | BigNumber | string) {
  return {
    type: UPDATE_APP_STATUS,
    data: {
      statusKey,
      value,
    },
  };
}
