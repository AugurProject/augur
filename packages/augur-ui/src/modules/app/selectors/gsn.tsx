import { createSelector } from 'reselect';
import { AppState } from 'store';
import { WalletState } from 'contract-dependencies-gsn';

export const selectAuthState = (state: AppState) => state.authStatus;
export const selectAppState = (state: AppState) => state.appStatus;

export const isGSNUnavailable = createSelector(
  selectAuthState,
  selectAppState,
  (authStatus, appStatus) => {
    const { gsnEnabled, walletStatus } = appStatus;
    const { isLogged } = authStatus;
    const gsnUnavailable =
    gsnEnabled &&
      isLogged &&
      [
        WalletState.WAITING_FOR_FUNDS,
        WalletState.PENDING,
      ].includes(walletStatus);

    return gsnUnavailable;
  }
);
