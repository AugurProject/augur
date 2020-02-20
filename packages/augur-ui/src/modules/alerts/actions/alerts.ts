import store, { AppState } from 'appStore';
import setAlertText from 'modules/alerts/actions/set-alert-text';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import makePath from 'modules/routes/helpers/make-path';
import { TRANSACTIONS } from 'modules/routes/constants/views';
import { selectCurrentTimestampInSeconds } from 'appStore/select-state';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  PREFILLEDSTAKE,
  DOINITIALREPORT,
  CONTRIBUTE,
  CREATEMARKET,
  CREATEYESNOMARKET,
  CREATECATEGORICALMARKET,
  CREATESCALARMARKET,
  PUBLICFILLORDER,
  INFO,
  PUBLICFILLBESTORDER,
  PUBLICFILLBESTORDERWITHLIMIT,
  PUBLICTRADE,
  PUBLICTRADEWITHLIMIT,
} from 'modules/common/constants';

export const ADD_ALERT = 'ADD_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const UPDATE_EXISTING_ALERT = 'UPDATE_EXISTING_ALERT';
export const CLEAR_ALERTS = 'CLEAR_ALERTS';

export function addAlert(alert: any) {
  return (dispatch: ThunkDispatch<void, any, Action>) => {
    if (alert != null) {
      const { universe } = store.getState() as AppState;
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

export function updateAlert(
  id: string,
  alert: any,
  dontMakeNewAlerts?: boolean
) {
  return (dispatch: ThunkDispatch<void, any, Action>): void => {
    if (alert) {
      const { alerts, loginAccount } = store.getState() as AppState;
      const alertName = alert.name.toUpperCase();
      alert.id = id;
      alert.uniqueId =
        alertName === PUBLICTRADE ? createUniqueOrderId(alert) : id;

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
      const foundAlert = alerts.find(
        findAlert =>
          findAlert.uniqueId === alert.uniqueId &&
          findAlert.name.toUpperCase() === alert.name.toUpperCase()
      );
      if (foundAlert) {
        dispatch(removeAlert(alert.uniqueId, alert.name));
        dispatch(
          addAlert({
            ...foundAlert,
            ...alert,
            name: foundAlert.name !== '' ? foundAlert.name : alert.name,
            params: {
              ...foundAlert.params,
              ...alert.params,
            },
          })
        );
      } else {
        dispatch(addAlert(alert));
      }
    }
  };
}
// We clear by 'alert level'.
// This will not surface in the UI just yet.
export function clearAlerts(alertLevel = INFO) {
  return {
    type: CLEAR_ALERTS,
    data: {
      level: alertLevel,
    },
  };
}
