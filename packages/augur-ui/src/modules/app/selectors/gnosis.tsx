import { createSelector } from 'reselect';
import { AppState } from 'appStore';
import { GnosisSafeState } from '@augurproject/gnosis-relay-api/src/GnosisRelayAPI';

export const selectAuthState = (state: AppState) => state.authStatus;
export const selectAppState = (state: AppState) => state.appStatus;

export const isGnosisUnavailable = createSelector(
  selectAuthState,
  selectAppState,
  (authStatus, appStatus) => {
    const { gnosisEnabled, gnosisStatus } = appStatus;
    const { isLogged } = authStatus;
    const gnosisUnavailable =
      gnosisEnabled &&
      isLogged &&
      [
        GnosisSafeState.WAITING_FOR_FUNDS,
        GnosisSafeState.CREATED,
        GnosisSafeState.UNAVAILABLE,
      ].includes(gnosisStatus);

    return gnosisUnavailable;
  }
);
