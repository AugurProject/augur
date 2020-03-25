import { createSelector } from 'reselect';
import { AppState } from 'appStore';
import { WALLET_STATUS } from '../actions/update-app-status';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';

export const selectAuthState = (state: AppState) => state.authStatus;
export const selectAppState = (state: AppState) => state.appStatus;

export const isGSNUnavailable = createSelector(
  selectAuthState,
  selectAppState,
  (authStatus, appStatus): boolean => {
    const { gsnEnabled } = appStatus;
    const { isLogged } = authStatus;
    const gsnUnavailable =
      gsnEnabled &&
      isLogged &&
      (appStatus[WALLET_STATUS] !== WALLET_STATUS_VALUES.CREATED);

    return gsnUnavailable;
  }
);
