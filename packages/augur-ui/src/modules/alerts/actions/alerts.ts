import store, { AppState } from 'store';
import setAlertText from 'modules/alerts/actions/set-alert-text';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
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

export function updateAlert(id: string, alert: any) {
  return (dispatch: ThunkDispatch<void, any, Action>): void => {
    alert.id = id;
    if (alert) {
      const { alerts, loginAccount } = store.getState() as AppState;
      const alertName = alert.name.toUpperCase();
      if (alertName === DOINITIALREPORT) {
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
      } else if (
        alertName === PUBLICFILLORDER ||
        alertName === PUBLICFILLBESTORDERWITHLIMIT ||
        alertName === PUBLICFILLBESTORDER
      ) {
        // if fill log comes in first
        if (
          alert.params.orderCreator.toUpperCase() !==
          loginAccount.address.toUpperCase()
        ) {
          // filler
          const foundOpenOrder = alerts.find(
            findAlert =>
              (findAlert.name.toUpperCase() === PUBLICTRADE ||
                findAlert.name.toUpperCase() === PUBLICTRADEWITHLIMIT) &&
              findAlert.id === id
          );
          if (foundOpenOrder) {
            const amountFilled = new BigNumber(alert.params.amountFilled);
            const orderAmount = new BigNumber(
              foundOpenOrder.params._amount || foundOpenOrder.params.amount
            );

            if (amountFilled.lt(orderAmount)) {
              // if part of order is unfilled, update placed order
              dispatch(
                updateExistingAlert(foundOpenOrder.id, {
                  ...foundOpenOrder,
                  params: {
                    ...foundOpenOrder.params,
                    _amount: orderAmount.minus(amountFilled),
                  },
                })
              );
            } else {
              // if full order was filled, then delete placed order
              dispatch(removeAlert(foundOpenOrder.id, foundOpenOrder.name));
            }
          }
        }
      } else if (
        alertName === PUBLICTRADE ||
        alertName === PUBLICTRADEWITHLIMIT
      ) {
        // if order placed log comes in first
        const foundFilledOrder = alerts.find(
          findAlert =>
            (findAlert.name.toUpperCase() === PUBLICFILLORDER ||
              findAlert.name.toUpperCase() === PUBLICFILLBESTORDERWITHLIMIT ||
              findAlert.name.toUpperCase() === PUBLICFILLBESTORDER) &&
            findAlert.id === id
        );
        if (foundFilledOrder) {
          if (
            foundFilledOrder.params.orderCreator.toUpperCase() !==
            loginAccount.address.toUpperCase()
          ) {
            const amountFilled = new BigNumber(
              foundFilledOrder.params.amountFilled
            );
            const orderAmount = new BigNumber(
              alert.params._amount || alert.params.amount
            );

            if (amountFilled.lt(orderAmount)) {
              // if part of order is unfilled, update placed order
              alert.params._amount = orderAmount.minus(amountFilled);
            } else {
              // if full order was filled, then no need to add the placed order
              return;
            }
          }
        }
      }
      const foundAlert = alerts.find(findAlert => {
        if (
          (findAlert.id === id && alert.name.toUpperCase() === CREATEMARKET) ||
          findAlert.name.toUpperCase() === CREATEMARKET
        ) {
          return (
            alertName === CREATEYESNOMARKET ||
            alertName === CREATESCALARMARKET ||
            alertName === CREATECATEGORICALMARKET ||
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
        dispatch(removeAlert(id, alert.name));
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
