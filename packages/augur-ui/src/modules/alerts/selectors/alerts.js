import { createSelector } from "reselect";

import { selectAlertsState } from "src/select-state";
import store from "src/store";

import * as alertLevels from "modules/common-elements/constants";

import { augur } from "services/augurjs";
import getValue from "utils/get-value";

export const selectAlertsByLevel = level => state =>
  selectAlertsState(state).filter(it => it.level === level);

export const selectCriticalAlerts = selectAlertsByLevel(alertLevels.CRITICAL);
export const selectInfoAlerts = selectAlertsByLevel(alertLevels.INFO);

export const selectInfoAlertsAndSeenCount = createSelector(
  selectInfoAlerts,
  alerts => {
    const networkId = augur.rpc.getNetworkID();
    const { universe } = store.getState();

    let filteredAlerts = alerts;
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
