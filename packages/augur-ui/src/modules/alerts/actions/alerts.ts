import store, { AppState } from 'store';
import * as constants from 'modules/common/constants';
import setAlertText from 'modules/alerts/actions/set-alert-text';
import { createBigNumber } from 'utils/create-big-number';
import makePath from 'modules/routes/helpers/make-path';
import { TRANSACTIONS } from 'modules/routes/constants/views';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
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
              level: constants.INFO,
              networkId: getNetworkId(),
              universe: universe.id,
              ...alert,
            },
          },
        };
        return fullAlert;
      };
      dispatch(setAlertText(alert, callback));
    }
  };
}

export function removeAlert(id: string) {
  return {
    type: REMOVE_ALERT,
    data: { id },
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
    return dispatch(setAlertText(alert, callback));
  };
}

export function updateAlert(id: string, alert: any) {
  return (dispatch: ThunkDispatch<void, any, Action>): void => {
    alert.id = id;
    if (alert) {
      const { alerts } = store.getState() as AppState;
      if (alert.name === DOINITIALREPORT) {
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
      const foundAlert = alerts.find(findAlert => {
        if (
          (findAlert.id === id && alert.name.toUpperCase() === CREATEMARKET) ||
          findAlert.name.toUpperCase() === CREATEMARKET
        ) {
          return (
            alert.name.toUpperCase() === CREATEYESNOMARKET ||
            alert.name.toUpperCase() === CREATESCALARMARKET ||
            alert.name.toUpperCase() === CREATECATEGORICALMARKET ||
            findAlert.name.toUpperCase() === CREATEYESNOMARKET ||
            findAlert.name.toUpperCase() === CREATESCALARMARKET ||
            findAlert.name.toUpperCase() === CREATECATEGORICALMARKET
          );
        }
        return (
          findAlert.id === id &&
          findAlert.name.toUpperCase() === alert.name.toUpperCase()
        );
      });
      if (foundAlert) {
        dispatch(removeAlert(id));
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
export function clearAlerts(alertLevel = constants.INFO) {
  return {
    type: CLEAR_ALERTS,
    data: {
      level: alertLevel,
    },
  };
}
