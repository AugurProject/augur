import React, { useEffect } from 'react';

import Alert from 'modules/alerts/components/alert';
import { Alert as AlertType } from 'modules/types';
import Styles from 'modules/alerts/components/toasts-view.styles.less';
import classNames from 'classnames';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getInfoAlertsAndSeenCount } from '../helpers/alerts';

interface ToastsViewProps {
  toggleAlerts: Function;
  updateExistingAlert: Function;
  onTradingTutorial?: boolean;
}

const ToastsView = ({
  toggleAlerts,
  updateExistingAlert,
  onTradingTutorial,
}: ToastsViewProps) => {
  const { alerts } = getInfoAlertsAndSeenCount();
  const toasts = alerts.filter(alert => alert.toast && !alert.seen);
  const toast = toasts[0];
  const { actions: { removeAlert }} = useAppStatusStore();
  useEffect(() => {
    const Timeout = setInterval(() => {
      const newToast = {
        name: toast?.name,
        toast: false,
      };
      if (toast) updateExistingAlert(toast.uniqueId, newToast);
    }, 2000);
    return () => clearInterval(Timeout);
  }, [toast]);
  
  if (!toast) return null;

  return (
    <div className={classNames(Styles.ToastsView, {[Styles.MoveDown]: onTradingTutorial})}>
      <Alert
        key={`${toast.id}-${toast.title}`}
        removeAlert={() => removeAlert(toast.uniqueId, toast.name)}
        toggleAlerts={toggleAlerts}
        showToast={true}
        timestampInMilliseconds={toast.timestamp}
        {...toast}
      />
    </div>
  );
};

export default ToastsView;
