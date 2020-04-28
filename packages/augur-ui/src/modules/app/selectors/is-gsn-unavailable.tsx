import { createSelector } from 'reselect';
import { AppState } from 'appStore';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';
import { AppStatusState } from 'modules/app/store/app-status';

export const selectAuthState = (state: AppState) => state.authStatus;

export const isGSNUnavailable = createSelector(
  selectAuthState,
  (authStatus): boolean => {
    const { gsnEnabled, walletStatus } = AppStatusState.get();
    const { isLogged } = authStatus;
    const gsnUnavailable =
      gsnEnabled &&
      isLogged &&
      (walletStatus !== WALLET_STATUS_VALUES.CREATED);

    return gsnUnavailable;
  }
);
