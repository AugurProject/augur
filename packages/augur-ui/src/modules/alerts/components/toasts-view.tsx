import React, { useEffect } from 'react';

import Alert from 'modules/alerts/components/alert';

import Styles from 'modules/alerts/components/toasts-view.styles.less';
import classNames from 'classnames';

interface ToastsViewProps {
  toasts: Array<any>;
  removeAlert: Function;
  toggleAlerts: Function;
  updateExistingAlert: Function;
  onTradingTutorial?: boolean;
}

const ToastsView = ({
  toasts,
  removeAlert,
  toggleAlerts,
  updateExistingAlert,
  onTradingTutorial,
}: ToastsViewProps) => {
  useEffect(() => {
    const Timeout = setInterval(() => {
      const newToast = {
        name: toasts[0].name,
        toast: false,
      };
      updateExistingAlert(toasts[0].uniqueId, newToast);
    }, 2000);
    return () => clearInterval(Timeout);
  });
  const toast = toasts[0];
  if (!toast) return null;
  return (
    <div className={classNames(Styles.ToastsView, {[Styles.MoveDown]: onTradingTutorial})}>
      <Alert
        key={`${toast.id}-${toast.title}`}
        removeAlert={() => removeAlert(toast.uniqueId, toast.name)}
        toggleAlerts={toggleAlerts}
        showToast={true}
        {...toast}
      />
    </div>
  );
};

export default ToastsView;
