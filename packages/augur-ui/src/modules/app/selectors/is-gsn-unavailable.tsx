import { createSelector } from 'reselect';
import { AppState } from 'appStore';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';
import { AppStatusState } from 'modules/app/store/app-status';

export const isGSNUnavailable = createSelector(
  (): boolean => {
    const { gsnEnabled, walletStatus, isLogged } = AppStatusState.get();
    const gsnUnavailable =
      gsnEnabled &&
      isLogged &&
      (walletStatus !== WALLET_STATUS_VALUES.CREATED);

    return gsnUnavailable;
  }
);
