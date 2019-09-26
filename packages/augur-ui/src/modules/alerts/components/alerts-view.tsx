import React, { Component } from "react";
import classNames from "classnames";

import NullStateMessage from "modules/common/null-state-message";
import Alert from "modules/alerts/components/alert";

import { Close } from "modules/common/icons";

import Styles from "modules/alerts/components/alerts-view.styles.less";
import ToggleHeightStyles from "utils/toggle-height.styles.less";

interface AlertsViewProps {
  alerts: Array<any>;
  updateExistingAlert: Function;
  removeAlert: Function;
  clearAlerts: Function;
  toggleAlerts: Function;
  alertsVisible: Boolean;
}

export default class AlertsView extends Component<AlertsViewProps> {
  alertsContainer: any = null;
  alerts: any = null;

  UNSAFE_componentWillUpdate(nextProps: AlertsViewProps) {
    if (this.props.alertsVisible && !nextProps.alertsVisible) {
      const { updateExistingAlert, alerts } = this.props;
      alerts.forEach(alert => {
        updateExistingAlert(alert.uniqueId, { ...alert, seen: true });
      });
    }
  }

  render() {
    const {
      removeAlert,
      toggleAlerts,
      clearAlerts,
      alerts,
      alertsVisible
    } = this.props;

    return (
      <div
        ref={alertsContainer => {
          this.alertsContainer = alertsContainer;
        }}
        className={classNames(Styles.parent, {
          [ToggleHeightStyles.target]: true,
          [ToggleHeightStyles.quick]: true,
          [ToggleHeightStyles.open]: alertsVisible
        })}
      >
        <section
          id="alerts_view"
          className={classNames(Styles.AlertsView, {
            [Styles.dark]: !(alerts && alerts.length)
          })}
        >
          <button
            className={Styles.close}
            onClick={e => {
              e.stopPropagation();
              toggleAlerts();
            }}
          >
            {Close}
          </button>
          {alerts && alerts.length ? (
            <div
              ref={alerts => {
                this.alerts = alerts;
              }}
              className={Styles.box}
            >
              {alerts.map((alert, i) => (
                <Alert
                  key={`${i}-${alert.id}-${alert.title}`}
                  removeAlert={() => removeAlert(alert.uniqueId, alert.name)}
                  toggleAlerts={toggleAlerts}
                  timestampInMilliseconds={alert.timestamp}
                  {...alert}
                />
              ))}
            </div>
          ) : (
            <NullStateMessage
              className={Styles.NullStateMessage}
              message="No Alerts"
            />
          )}
          {alerts && alerts.length ? (
            <div className={Styles.dismissContainer}>
              <button
                onClick={e => clearAlerts()}
                role="button"
                tabIndex={0}
              >
                Clear All
              </button>
            </div>
          ) : null}
        </section>
      </div>
    );
  }
}
