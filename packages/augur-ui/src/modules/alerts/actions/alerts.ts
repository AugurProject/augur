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
  CANCELORDERS,
} from 'modules/common/constants';
import {
  getNetworkId,
} from 'modules/contracts/actions/contractCalls';
import { AppStatus } from 'modules/app/store/app-status';
import {
  createUniqueOrderId,
  createAlternateUniqueOrderId,
} from 'modules/alerts/helpers/alerts';
import { createBigNumber } from 'utils/create-big-number';
import { Alert } from 'modules/types';

export const ADD_ALERT = 'ADD_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const UPDATE_EXISTING_ALERT = 'UPDATE_EXISTING_ALERT';
export const CLEAR_ALERTS = 'CLEAR_ALERTS';

export function addAlert(alert: Partial<Alert>) {
  if (alert != null) {
    const { universe } = AppStatus.get();
    const callback = alertUpdated =>
      AppStatus.actions.addAlert({
        seen: false,
        level: INFO,
        networkId: getNetworkId(),
        universe: universe.id,
        ...alertUpdated,
      });
    try {
      setAlertText(alert, callback);
    } catch (error) {
      callback(error);
    }
  }
}

export function loadAlerts(alerts) {
  const { universe: { id: universe }} = AppStatus.get();
  const networkId = getNetworkId();
  const processedAlerts = alerts.map(n => updateAlert(n.uniqueId, n, true, true));
  const updatedAlerts = processedAlerts.map(a => {
    const updatedAlert = setAlertText(a, () => {}, true);
    return ({
      seen: false,
      level: INFO,
      networkId,
      universe,
      ...updatedAlert,
    });
  });
  AppStatus.actions.loadAlerts(updatedAlerts);
}

export function updateExistingAlert(id, alert) {
  const callback = alertUpdated =>
    AppStatus.actions.updateAlert(id, alertUpdated);
  try {
    setAlertText(alert, callback);
  } catch (error) {
    return callback(error);
  }
}

export function updateAlert(
  id: string,
  alert: any,
  dontMakeNewAlerts?: boolean,
  returnOnly?: boolean,
) {
  if (alert) {
    const { alerts } = AppStatus.get();
    const alertName = alert?.name?.toUpperCase();
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
          updateAlert(id, {
            ...alert,
            params: {
              ...alert.params,
              preFilled: true,
            },
            name: CONTRIBUTE,
          });
        }
        break;
      }
    }

    let foundAlert =
      alertName === REDEEMSTAKE
        ? alerts.find(
            findAlert =>
              findAlert.id === alert.id &&
              findAlert.name.toUpperCase() === REDEEMSTAKE
          )
        : alerts.find(
            findAlert =>
              findAlert.uniqueId === alert.uniqueId &&
              findAlert.name.toUpperCase() === alert.name.toUpperCase()
          );

    if (foundAlert) {
      updateExistingAlert(alert.uniqueId, {
        ...foundAlert,
        ...alert,
        name: foundAlert.name !== '' ? foundAlert.name : alert.name,
        params: {
          ...foundAlert.params,
          ...alert.params,
          repReceived:
            alert.params.repReceived &&
            foundAlert.params.repReceived &&
            createBigNumber(alert.params.repReceived)
              .plus(createBigNumber(foundAlert.params.repReceived)),
        },
      });
    } else {
      if (returnOnly) {
        return alert;
      } else {
        addAlert(alert);
      }
    }
  }
}
