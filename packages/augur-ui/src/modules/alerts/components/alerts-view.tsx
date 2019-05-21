import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import Alert from "modules/alerts/components/alert";

import { Close } from "modules/common/components/icons";

import Styles from "modules/alerts/components/alerts-view.styles";
import ToggleHeightStyles from "utils/toggle-height.styles";

interface AlertsViewProps {
  alerts: Array<any>;
  updateAlert: Function;
  removeAlert: Function;
  clearAlerts: Function;
  toggleAlerts: Function;
  alertsVisible: Boolean;
}

export default class AlertsView extends Component<AlertsViewProps> {
  static propTypes = {
    alerts: PropTypes.array.isRequired,
    updateAlert: PropTypes.func.isRequired,
    removeAlert: PropTypes.func.isRequired,
    clearAlerts: PropTypes.func.isRequired,
    toggleAlerts: PropTypes.func.isRequired,
    alertsVisible: PropTypes.bool.isRequired
  };

  alertsContainer: any = null;
  alerts: any = null;

  componentWillUpdate(nextProps: AlertsViewProps) {
    if (this.props.alertsVisible && !nextProps.alertsVisible) {
      const { updateAlert, alerts } = this.props;
      alerts.forEach(alert => {
        updateAlert(alert.id, { seen: true });
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
                  key={`${alert.id}-${alert.title}`}
                  removeAlert={() => removeAlert(alert.id)}
                  toggleAlerts={toggleAlerts}
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
                Dismiss All
              </button>
            </div>
          ) : null}
        </section>
      </div>
    );
  }
}
