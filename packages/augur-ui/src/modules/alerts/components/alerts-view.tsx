import React from "react";
import classNames from "classnames";

import NullStateMessage from "modules/common/null-state-message";
import Alert from "modules/alerts/components/alert";
import {Alert as AlertType} from 'modules/types'
import { Close } from "modules/common/icons";

import Styles from "modules/alerts/components/alerts-view.styles.less";
import ToggleHeightStyles from "utils/toggle-height.styles.less";

interface AlertsViewProps {
  alerts: AlertType[];
  updateExistingAlert: (alertId: string, alert: AlertType) => void;
  removeAlert: (alertId:string, alertName:string) => void;
  clearAlerts: () => void;
  toggleAlerts: () => void;
  alertsVisible: boolean;
}


const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  updateExistingAlert,
  removeAlert,
  clearAlerts,
  toggleAlerts,
  alertsVisible
})=>{

  React.useEffect(() =>{
    if (alertsVisible) {
      alerts.forEach(alert => {
        updateExistingAlert(alert.uniqueId, { ...alert, seen: true });
      });
    }
  }, [alertsVisible])

  return (
    <div
      className={classNames(Styles.parent, {
        [ToggleHeightStyles.target]: true,
        [ToggleHeightStyles.quick]: true,
        [ToggleHeightStyles.open]: alertsVisible
      })}
    >
      <section
        id="alerts_view"
        className={classNames(Styles.AlertsView, {
          [Styles.dark]: !(alerts && alerts.length),
          [Styles.isOpen]: alertsVisible,
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
            className={Styles.box}
          >
            {alerts.map((alert, i) => (
              <Alert
                key={`${i}-${alert.uniqueId}-${alert.title}`}
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
export default AlertsView;
