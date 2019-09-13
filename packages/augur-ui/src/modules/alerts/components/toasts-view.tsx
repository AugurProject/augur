import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import NullStateMessage from "modules/common/null-state-message";
import Alert from "modules/alerts/components/alert";

import { Close } from "modules/common/icons";

import Styles from "modules/alerts/components/toasts-view.styles.less";
import ToggleHeightStyles from "utils/toggle-height.styles.less";

interface ToastsViewProps {
  toasts: Array<any>;
  removeAlert: Function;
  toggleAlerts: Function;
  updateAlert: Function;
}

export default class ToastsView extends Component<ToastsViewProps, {}> {

  componentDidMount() {
    this.timeout = setInterval(() => {
      if (this.props.toasts.length > 0) {
        this.props.updateAlert(this.props.toasts[0].id, {...this.props.toasts[0], toast: false});
      }
    }, 2000);
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
                  removeAlert={() => removeAlert(toast.id)}
                  toggleAlerts={toggleAlerts}
                  noShow={i !== 0}
                  {...toast}
              />
          ))}
        </div>
    );
  }
}
