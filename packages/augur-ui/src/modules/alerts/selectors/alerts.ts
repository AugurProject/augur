import { createSelector } from 'reselect';
import store, { AppState } from 'appStore';
import * as alertLevels from 'modules/common/constants';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import getValue from 'utils/get-value';
import { SUCCESS, FAILURE } from 'modules/common/constants';

export const selectAlertsByLevel = level => state =>
  state.alerts.filter(it => it.level === level);

export const selectCriticalAlerts = selectAlertsByLevel(alertLevels.CRITICAL);
export const selectInfoAlerts = selectAlertsByLevel(alertLevels.INFO);

export const selectInfoAlertsAndSeenCount = createSelector(
  selectInfoAlerts,
  alerts => {
    const { universe, connection, authStatus } = store.getState() as AppState;
    if (!connection.isConnected || !authStatus.isLogged)
      return { unseenCount: 0, alerts: [] };

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
      .sort((a, b) => getValue(b, 'timestamp') - getValue(a, 'timestamp'));

    const unseenCount = sortedAlerts.reduce((p, alert) => {
      if (!alert.seen) return 1 + p;
      return p;
    }, 0);

    return {
      unseenCount,
      alerts: sortedAlerts,
    };
  }
);
