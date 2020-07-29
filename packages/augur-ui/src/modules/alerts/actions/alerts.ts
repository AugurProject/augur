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
  SUCCESS,
  ETH_RESERVE_INCREASE,
  NULL_ADDRESS,
  CANCELORDERS,
} from 'modules/common/constants';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { Alert } from 'modules/types';

export const ADD_ALERT = 'ADD_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const UPDATE_EXISTING_ALERT = 'UPDATE_EXISTING_ALERT';
export const CLEAR_ALERTS = 'CLEAR_ALERTS';

export function addAlert(alert: Partial<Alert>) {
  return (dispatch: ThunkDispatch<void, any, Action>) => {
    if (alert != null) {
      const { universe } = store.getState() as AppState;
      const callback = (alert: Alert) => {
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
        console.error(error);
        callback(null);
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
  const timestamp = alert.timestamp;

  return `${alert.id}_${price}_${outcome}_${direction}_${timestamp}`;
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
      alert.uniqueId = alert.uniqueId || id;

      switch (alertName) {
        case PUBLICTRADE:
        case PUBLICFILLORDER: {
          alert.uniqueId = createUniqueOrderId(alert);
          break;
        }
        case CANCELORDERS: {
          alert.id = alert.params?.hash || id;
          break;
        }
        case CLAIMTRADINGPROCEEDS: {
          alert.uniqueId = createAlternateUniqueOrderId(alert);
          if (createBigNumber(alert.params.numPayoutTokens).eq(ZERO)) {
            return;
          }
          break;
        }
        case DOINITIALREPORT: {
          if (!dontMakeNewAlerts) {
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
          break;
        }
      }

      let foundAlert =
        alertName === REDEEMSTAKE
          ? alerts.find(
              (findAlert) =>
                findAlert.id === alert.id &&
                findAlert.name.toUpperCase() === REDEEMSTAKE
            )
          : alerts.find(
              (findAlert) =>
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
              repReceived:
                alert.params.repReceived &&
                foundAlert.params.repReceived &&
                createBigNumber(alert.params.repReceived).plus(
                  createBigNumber(foundAlert.params.repReceived)
                ),
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
