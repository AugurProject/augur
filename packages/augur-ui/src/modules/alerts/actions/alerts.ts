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
import {
  getNetworkId,
  getEthForDaiRate,
} from 'modules/contracts/actions/contractCalls';
import { AppStatus } from 'modules/app/store/app-status';
import {
  createUniqueOrderId,
  createAlternateUniqueOrderId,
} from 'modules/alerts/helpers/alerts';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { Alert } from 'modules/types';
import { convertAttoValueToDisplayValue } from '@augurproject/utils';

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
      callback(error, null);
    }
  }
}

export function updateExistingAlert(id, alert) {
  const callback = alertUpdated =>
    AppStatus.actions.updateAlert(id, alertUpdated);
  try {
    setAlertText(alert, callback);
  } catch (error) {
    return callback(error, null);
  }
}

export function updateAlert(
  id: string,
  alert: any,
  dontMakeNewAlerts?: boolean
) {
  if (alert) {
    const { alerts } = AppStatus.get();
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
      addAlert(alert);
    }
  }
}

export const addEthIncreaseAlert = (
  daiBalance: string,
  oldEthBalance: string,
  newEthBalance: string
) => {
  // eth balances hasn't be initialized to signing wallets eth balance
  if (oldEthBalance === null) return null;
  const {
    env: {
      gsn: {
        minDaiForSignerETHBalanceInDAI: daiCutoff,
        desiredSignerBalanceInETH,
      },
    },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  // user dai balance too low to have ETH reserve
  if (createBigNumber(daiBalance).lt(daiCutoff)) return null;

  const maxEthReserve = createBigNumber(desiredSignerBalanceInETH);
  const aboveCutoff = createBigNumber(oldEthBalance).isGreaterThan(
    createBigNumber(maxEthReserve)
  );
  // user already has Fee reserve topped off
  if (aboveCutoff) return null;

  // ETH increase can only be up to max Fee reserve
  const toppedOffValue = BigNumber.min(maxEthReserve, newEthBalance);
  const increase = createBigNumber(toppedOffValue).minus(
    createBigNumber(oldEthBalance)
  );
  if (increase.gt(0)) {
    const attoEthToDaiRate: BigNumber = getEthForDaiRate();
    const amount = ethToDai(
      increase,
      createBigNumber(attoEthToDaiRate.div(10 ** 18) || 0)
    );
    const timestamp = currentAugurTimestamp * 1000;
    addAlert({
      name: ETH_RESERVE_INCREASE,
      uniqueId: String(timestamp),
      toast: true,
      description: `Your ETH balance has increased by $${amount.formatted} DAI`,
      title: 'ETH reserves replenished',
      status: SUCCESS,
      timestamp,
      params: {
        marketId: NULL_ADDRESS,
      },
    });
  }
  return null;
};
