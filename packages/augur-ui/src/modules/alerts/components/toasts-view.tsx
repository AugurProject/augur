import React, { Component } from 'react';

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

export default class ToastsView extends Component<ToastsViewProps, {}> {

  componentDidMount() {
    this.timeout = setInterval(() => {
      const newToast = { 
        name: this.props.toasts[0].name, 
        toast: false,
      };
      //this.props.updateExistingAlert(this.props.toasts[0].uniqueId, newToast);
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  render() {
    const { removeAlert, toggleAlerts, toasts, onTradingTutorial } = this.props;

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
  }
}
