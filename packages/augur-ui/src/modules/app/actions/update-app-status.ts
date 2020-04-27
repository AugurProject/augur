import { FormattedNumber } from 'modules/types';

export const UPDATE_APP_STATUS = 'UPDATE_APP_STATUS';
export const ETH_TO_DAI_RATE = 'ethToDaiRate';
export const REP_TO_DAI_RATE = 'repToDaiRate';
export const GSN_ENABLED = 'gsnEnabled';
export const GNOSIS_STATUS = 'gnosisStatus';
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
