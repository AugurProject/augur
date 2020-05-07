import store, { AppState } from 'appStore';
import setAlertText from 'modules/alerts/actions/set-alert-text';
import {
  CLAIMTRADINGPROCEEDS,
  CONTRIBUTE,
  DOINITIALREPORT,
  INFO,
  PUBLICFILLORDER,
  PUBLICTRADE,
  REDEEMSTAKE,
  ZERO,
} from 'modules/common/constants';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { AppStatus } from 'modules/app/store/app-status';

export const ADD_ALERT = 'ADD_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const UPDATE_EXISTING_ALERT = 'UPDATE_EXISTING_ALERT';
export const CLEAR_ALERTS = 'CLEAR_ALERTS';

export function addAlert(alert: any) {
  return (dispatch: ThunkDispatch<void, any, Action>) => {
    if (alert != null) {
      const { universe } = AppStatus.get();
      const callback = (alert: any) => {
        const fullAlert = {
          type: ADD_ALERT,
          data: {
            alert: {
              seen: false,
              level: INFO,
              networkId: getNetworkId(),
              universe: universe.id,
              ...alert,
            },
          },
        };
        return fullAlert;
      };
      try {
        dispatch(setAlertText(alert, callback));
      } catch (error) {
        callback(error, null);
      }
    }
  };
}

export function removeAlert(id: string, name: string) {
  return {
    type: REMOVE_ALERT,
    data: { id, name },
  };
}

export function updateExistingAlert(id, alert) {
  return (dispatch, getState) => {
    const callback = alert => {
      const fullAlert = {
        type: UPDATE_EXISTING_ALERT,
        data: {
          id,
          alert,
        },
      };
      return fullAlert;
    };
    try {
      return dispatch(setAlertText(alert, callback));
    } catch (error) {
      return callback(error, null);
    }
  };
}

function createUniqueOrderId(alert) {
  const price = alert.params._price
    ? alert.params._price.toString()
    : new BigNumber(alert.params.price).toString();
  const outcome = alert.params._outcome
    ? alert.params._outcome.toString()
    : new BigNumber(alert.params.outcome).toString();
  const direction = alert.params._direction
    ? alert.params._direction.toString()
    : alert.params.orderType;

  return `${alert.id}_${price}_${outcome}_${direction}`;
}

function createAlternateUniqueOrderId(alert) {
  return `${alert.id}_${alert.params.logIndex}`;
}

export function updateAlert(
  id: string,
  alert: any,
  dontMakeNewAlerts?: boolean
) {
  return (dispatch: ThunkDispatch<void, any, Action>): void => {
    if (alert) {
      const { alerts } = store.getState() as AppState;
      const alertName = alert.name.toUpperCase();
      alert.id = id;
      alert.uniqueId =
        alertName === PUBLICTRADE || alertName === PUBLICFILLORDER ? createUniqueOrderId(alert) : id;

      if (alertName === CLAIMTRADINGPROCEEDS) {
        alert.uniqueId = createAlternateUniqueOrderId(alert);
        if (createBigNumber(alert.params.numPayoutTokens).eq(ZERO)) {
          return;
        }
      }

      if (alertName === DOINITIALREPORT && !dontMakeNewAlerts) {
        dispatch(
          updateAlert(id, {
            ...alert,
            params: {
              ...alert.params,
              preFilled: true,
            },
            name: CONTRIBUTE,
          })
        );
      }

      let foundAlert = alerts.find(
        findAlert =>
          findAlert.uniqueId === alert.uniqueId &&
          findAlert.name.toUpperCase() === alert.name.toUpperCase()
      );
      if (alertName === REDEEMSTAKE) {
        foundAlert = alerts.find(
          findAlert =>
            findAlert.id === alert.id &&
            findAlert.name.toUpperCase() === REDEEMSTAKE
        );
      }
      if (foundAlert) {
        AppStatus.actions.removeAlert(alert.uniqueId, alert.name);
        dispatch(removeAlert(alert.uniqueId, alert.name));
        dispatch(
          addAlert({
            ...foundAlert,
            ...alert,
            name: foundAlert.name !== '' ? foundAlert.name : alert.name,
            params: {
              ...foundAlert.params,
              ...alert.params,
              repReceived: alert.params.repReceived && foundAlert.params.repReceived && createBigNumber(alert.params.repReceived).plus(createBigNumber(foundAlert.params.repReceived))
            },
          })
        );
        AppStatus.actions.updateAlert({
          ...foundAlert,
          ...alert,
          name: foundAlert.name !== '' ? foundAlert.name : alert.name,
          params: {
            ...foundAlert.params,
            ...alert.params,
            repReceived: alert.params.repReceived && foundAlert.params.repReceived && createBigNumber(alert.params.repReceived).plus(createBigNumber(foundAlert.params.repReceived))
          },
        });
      } else {
        dispatch(addAlert(alert));
        AppStatus.actions.updateAlert(alert);
      }
    }
  };
}
// We clear by 'alert level'.
// This will not surface in the UI just yet.
export function clearAlerts(alertLevel = INFO) {
  AppStatus.actions.clearAlerts(alertLevel);
  return {
    type: CLEAR_ALERTS,
    data: {
      level: alertLevel,
    },
  };
}
