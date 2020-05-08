import React, { useEffect } from 'react';
import classNames from 'classnames';

import NullStateMessage from 'modules/common/null-state-message';
import Alert from 'modules/alerts/components/alert';
import { Alert as AlertType } from 'modules/types';
import { Close } from 'modules/common/icons';

import Styles from 'modules/alerts/components/alerts-view.styles.less';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getInfoAlertsAndSeenCount } from 'modules/alerts/helpers/alerts';
import { INFO } from 'modules/common/constants';

interface AlertsViewProps {
  updateExistingAlert: (alertId: string, alert: AlertType) => void;
}

const AlertsView: React.FC<AlertsViewProps> = ({
  updateExistingAlert,
}) => {
  const { alerts } = getInfoAlertsAndSeenCount();
  const {
    isLogged,
    isAlertsMenuOpen,
    actions: { setIsAlertsMenuOpen, clearAlerts, removeAlert },
  } = useAppStatusStore();
  const alertsVisible = isLogged && isAlertsMenuOpen;
  useEffect(() => {
    if (alertsVisible) {
      alerts.forEach(alert => {
        updateExistingAlert(alert.uniqueId, { ...alert, seen: true });
      });
    }
  }, [alertsVisible]);

  return (
    <div
      className={classNames(Styles.parent, {
        [ToggleHeightStyles.target]: true,
        [ToggleHeightStyles.quick]: true,
        [ToggleHeightStyles.open]: isAlertsMenuOpen,
      })}
    >
      <section
        id="alerts_view"
        className={classNames(Styles.AlertsView, {
          [Styles.dark]: !(alerts && alerts.length),
          [Styles.isOpen]: isAlertsMenuOpen,
        })}
      >
        <button
          className={Styles.close}
          onClick={e => {
            e.stopPropagation();
            setIsAlertsMenuOpen(!isAlertsMenuOpen);
          }}
        >
          {Close}
        </button>
        {alerts && alerts.length ? (
          <div className={Styles.box}>
            {alerts.map((alert, i) => (
              <Alert
                key={`${i}-${alert.uniqueId}-${alert.title}`}
                removeAlert={() => removeAlert(alert.uniqueId, alert.name)}
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
            <button onClick={e => clearAlerts(INFO)} role="button" tabIndex={0}>
              Clear All
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
};
export default AlertsView;
