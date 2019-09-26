import React, { Component } from "react";

import Alert from "modules/alerts/components/alert";

import Styles from "modules/alerts/components/toasts-view.styles.less";

interface ToastsViewProps {
  toasts: Array<any>;
  removeAlert: Function;
  toggleAlerts: Function;
  updateExistingAlert: Function;
}

export default class ToastsView extends Component<ToastsViewProps, {}> {

  componentDidMount() {
    this.timeout = setInterval(() => {
      if (this.props.toasts.length > 0) {
        const newToast = { 
          name: this.props.toasts[0].name, 
          toast: false,
        };
        this.props.updateExistingAlert(this.props.toasts[0].uniqueId, newToast);
      }
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }
  render() {
    const {
      removeAlert,
      toggleAlerts,
      toasts,
    } = this.props;

    return (
        <div className={Styles.ToastsView}>
          {toasts.map((toast, i) => (
              <Alert
                  key={`${toast.id}-${toast.title}`}
                  removeAlert={() => removeAlert(toast.uniqueId, toast.name)}
                  toggleAlerts={toggleAlerts}
                  noShow={i !== 0}
                  showToast={true}
                  {...toast}
              />
          ))}
        </div>
    );
  }
}
