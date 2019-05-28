import { createSelector } from "reselect";
import store from "store";
import * as alertLevels from "modules/common-elements/constants";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import getValue from "utils/get-value";

export const selectAlertsByLevel = level => state =>
  state.alerts.filter(it => it.level === level);

export const selectCriticalAlerts = selectAlertsByLevel(alertLevels.CRITICAL);
export const selectInfoAlerts = selectAlertsByLevel(alertLevels.INFO);

export const selectInfoAlertsAndSeenCount = createSelector(
  selectInfoAlerts,
  alerts => {
    const { universe, connection } = store.getState();
    if (!connection.isConnected) return { unseenCount: 0, alerts: [] };

    let filteredAlerts = alerts;
    const networkId = getNetworkId();
    if (networkId && universe) {
      // Filter out alerts from other networks/universes
      filteredAlerts = alerts
        .filter(
          alert =>
            (alert.networkId === networkId.toString() &&
              alert.universe === universe.id) ||
            typeof alert.networkId === "undefined" ||
            typeof alert.universe === "undefined"
        )
        .reverse();
    }
    const sortedAlerts = filteredAlerts
      .map((alert, i) => ({
        ...alert,
        index: i
      }))
      .sort((a, b) => getValue(b, "timestamp") - getValue(a, "timestamp"));

    const unseenCount = sortedAlerts.reduce((p, alert) => {
      if (!alert.seen) return 1 + p;
      return p;
    }, 0);

    return {
      unseenCount,
      alerts: sortedAlerts
    };
  }
);
