import { FormattedNumber } from 'modules/types';

export const UPDATE_APP_STATUS = 'UPDATE_APP_STATUS';
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
