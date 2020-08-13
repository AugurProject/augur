import { AppStatus } from 'modules/app/store/app-status';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { SUCCESS, FAILURE, INFO, HEX_BUY, BUY_INDEX, SELL_INDEX } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';

export const getAlertsByLevel = level =>
  AppStatus.get().alerts.filter(it => it.level === level);

export const getInfoAlertsAndSeenCount = () => {
  const alerts = getAlertsByLevel(INFO);
  const { universe, isLogged, isConnected } = AppStatus.get();
  if (!isConnected || !isLogged) return { unseenCount: 0, alerts: [] };

  let filteredAlerts = alerts;
  const networkId = getNetworkId();
  if (networkId && universe) {
    // Filter out alerts from other networks/universes
    filteredAlerts = alerts
      .filter(
        alert =>
          (alert.networkId === networkId.toString() &&
            alert.universe === universe.id &&
            alert.description &&
            (alert.status.toUpperCase() === FAILURE.toUpperCase() ||
              alert.status.toUpperCase() === SUCCESS.toUpperCase())) ||
          typeof alert.networkId === 'undefined' ||
          typeof alert.universe === 'undefined'
      )
      .reverse();
  }
  const sortedAlerts = filteredAlerts
    .map((alert, i) => ({
      ...alert,
      index: i,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);

  const unseenCount = sortedAlerts.reduce((p, alert) => {
    if (!alert.seen) return 1 + p;
    return p;
  }, 0);

  return {
    unseenCount,
    alerts: sortedAlerts,
  };
};

export function createUniqueOrderId({ id, params }) {
  const price = params._price
    ? params._price.toString()
    : createBigNumber(params.price).toString();
  const outcome = params._outcome
    ? params._outcome.toString()
    : createBigNumber(params.outcome).toString();
  let direction = params._direction
    ? params._direction.toString()
    : params.orderType;
  
  direction = direction === HEX_BUY || direction === BUY_INDEX ? BUY_INDEX : SELL_INDEX;
  return `${id}_${price}_${outcome}_${direction}`;
}

export function createAlternateUniqueOrderId({ id, params }) {
  return `${id}_${params.logIndex}`;
}
