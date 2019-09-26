import React, { Component } from 'react';

import Alert from 'modules/alerts/components/alert';

import Styles from 'modules/alerts/components/toasts-view.styles.less';

interface ToastsViewProps {
  toasts: Array<any>;
  removeAlert: Function;
  toggleAlerts: Function;
  updateExistingAlert: Function;
}

export default class ToastsView extends Component<ToastsViewProps, {}> {
  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  componentDidUpdate = (prevProps: ToastsViewProps) => {
    if (
      this.props.toasts.length > 0 &&
      prevProps.toasts.length !== this.props.toasts.length
    ) {
      this.timeout = setTimeout(() => {
        if (this.props.toasts[0]) {
            const newToast = {
            name: this.props.toasts[0].name,
            toast: false,
          };
          this.props.updateExistingAlert(this.props.toasts[0].uniqueId, newToast);
        }
      }, 2000);
    }
  };

  render() {
    const { removeAlert, toggleAlerts, toasts } = this.props;

    const toast = toasts[0];
    if (!toast) return null;

    return (
      <div className={Styles.ToastsView}>
        <Alert
          key={`${toast.id}-${toast.title}`}
          removeAlert={() => removeAlert(toast.uniqueId, toast.name)}
          toggleAlerts={toggleAlerts}
          showToast={true}
          {...toast}
        />
      </div>
    );
  }
}
