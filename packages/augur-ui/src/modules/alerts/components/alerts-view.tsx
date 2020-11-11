import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import NullStateMessage from 'modules/common/null-state-message';
import Alert from 'modules/alerts/components/alert';
import { Close, Alerts } from 'modules/common/icons';

import Styles from 'modules/alerts/components/alerts-view.styles.less';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getInfoAlertsAndSeenCount } from 'modules/alerts/helpers/alerts';
import { INFO, THEMES } from 'modules/common/constants';
import { NOTIFICATIONS, ALERTS } from 'modules/app/store/constants';
import { updateExistingAlert } from '../actions/alerts';
import { useNotifications } from 'modules/account/components/notifications';

const TABS = {
  NOTIFICATIONS,
  ALERTS,
};
const AlertsView = () => {
  const { alerts } = getInfoAlertsAndSeenCount();
  const {
    theme,
    oddsType,
    isLogged,
    isAlertsMenuOpen,
    actions: { setIsAlertsMenuOpen, clearAlerts, removeAlert },
  } = useAppStatusStore();
  const { rows, newNotificationCount, notificationCount } = useNotifications();
  const [tab, setTab] = useState(ALERTS);
  const isSports = theme === THEMES.SPORTS;
  const alertsVisible = isLogged && isAlertsMenuOpen;
  const hasAlerts = alerts?.length;

  useEffect(() => {
    if (alertsVisible) {
      alerts.forEach(alert =>
        updateExistingAlert(alert.uniqueId, { ...alert, seen: true })
      );
    } else {
      alerts.forEach(alert =>
        updateExistingAlert(alert.uniqueId, { ...alert })
      );
    }
  }, [alertsVisible, theme, oddsType]);

  return (
    <div
      className={classNames(
        Styles.parent,
        ToggleHeightStyles.target,
        ToggleHeightStyles.quick,
        {
          [ToggleHeightStyles.open]: isAlertsMenuOpen,
        }
      )}
    >
      <section
        id="alerts_view"
        className={classNames(Styles.AlertsView, {
          [Styles.noAlerts]: !hasAlerts,
          [Styles.isOpen]: isAlertsMenuOpen,
          [Styles.AlertsTab]: (isSports && tab === ALERTS && alerts.length)
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
        {tab === ALERTS ? 
        (alerts && alerts.length) ? (
          <div className={Styles.box}>
            {alerts.map((alert, i) => (
              <Alert
                key={alert.uniqueId}
                removeAlert={() => removeAlert(alert.uniqueId, alert.name)}
                timestampInMilliseconds={alert.timestamp}
                {...alert}
              />
            ))}
          </div>
        ) : (
          <NullStateMessage
            icon={Alerts(0)}
            className={Styles.NullStateMessage}
            message="You don’t have any alerts"
            subMessage="We’ll let you know when you have an update!"
          />
        ) : 
        (notificationCount ? (
          <div className={Styles.box}>
            {rows.map((card, i) => card)}
          </div>
        ) : (
          <NullStateMessage
            icon={Alerts(0)}
            className={Styles.NullStateMessage}
            message="You don’t have any notifications"
            subMessage="We’ll let you know when you have an update!"
          />
        )}
        <div className={Styles.dismissContainer}>
          <span>Alerts</span>
          {alerts && alerts.length ? (
            <button onClick={e => clearAlerts(INFO)} role="button" tabIndex={0}>
              Clear All
            </button>
          ) : null}
        </div>
        <ul className={Styles.SportsHeader}>
          <li
            className={classNames({ [Styles.Selected]: tab === NOTIFICATIONS })}
          >
            <button
              onClick={() => setTab(NOTIFICATIONS)}
            >{`${NOTIFICATIONS} (${notificationCount})`}</button>
          </li>
          <li className={classNames({ [Styles.Selected]: tab === ALERTS })}>
            <button
              onClick={() => setTab(ALERTS)}
            >{`${ALERTS} (${alerts.length})`}</button>
          </li>
        </ul>
      </section>
    </div>
  );
};
export default AlertsView;
