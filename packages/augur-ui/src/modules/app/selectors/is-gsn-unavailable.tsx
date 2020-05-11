import { createSelector } from 'reselect';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

export const isGSNUnavailable = createSelector(
  (): boolean => {
    const { gsnEnabled, walletStatus, isLogged } = AppStatus.get();
    const gsnUnavailable =
      gsnEnabled &&
      isLogged &&
      (walletStatus !== WALLET_STATUS_VALUES.CREATED);

    return gsnUnavailable;
  }
);
