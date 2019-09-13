import {
  ADD_ALERT,
  REMOVE_ALERT,
  UPDATE_ALERT,
  CLEAR_ALERTS
} from "modules/alerts/actions/alerts";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { CLEAR_LOGIN_ACCOUNT } from "modules/account/actions/login-account";
import { Alert, BaseAction } from "modules/types";

const DEFAULT_STATE: Array<Alert> = [];

/**
 * @typedef {Object} AlertAction
 * @property {string} text - string to show as a call to action.
 * @property {function} actionFn - Called when the user clicks the alert.
 *
 */

/**
 * @typedef {Object} Alert
 * @property {string} id - hash identifier
 * @property {string} name - action that occurred, truncated in UI
 * @property {string} title - title to display, truncated in UI
 * @property {string} description - additional details, truncated in UI
 * @property {string} details - additional details, truncated in UI
 * @property {Object} timestamp - UTC epoch
 * @property {enum} level - alert level
 * @property {string} [href] - link to more context
 * @property {AlertAction} [action] - Config for alert bar. Note: This is mutually exclusive with 'href'.
 *
 */

/**
 * @param {Alert[]} alerts
 * @param {Object} action
 * @param {Alert} action.data
 * @param {string} action.type
 * @returns {Alert[]}
 *
 */
export default function alert(alerts = DEFAULT_STATE, { data, type }: BaseAction): Array<Alert> {
  switch (type) {
    case ADD_ALERT: {
      const isDuplicate =
        alerts.findIndex(
          alert =>
            alert.id === data.alert.id && alert.title === data.alert.title
        ) !== -1;

      if (isDuplicate) return alerts;

      return [...alerts, data.alert];
    }
    case REMOVE_ALERT:
      return alerts.filter((alert, i) => alert.id !== data.id);
    case UPDATE_ALERT:
      return alerts.map((alert, i) => {
        if (alert.id !== data.id) {
          return alert;
        }
        // don't except false unless status has changed
        if (data.alert.status && alert.status !== data.alert.status) {
          data.alert.seen = data.alert.seen || false;
        } else if (alert.status === data.alert.status && !data.alert.seen) {
          data.alert.seen = alert.seen;
        }

        return {
          ...alert,
          ...data.alert
        };
      });

    case CLEAR_ALERTS:
      return alerts.filter(it => it.level !== data.level);

    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return alerts;
  }
}
