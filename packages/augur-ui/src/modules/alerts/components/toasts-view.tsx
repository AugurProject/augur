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
}

interface ToastsViewState {
    toastsToShow: Array<any>
}

export default class ToastsView extends Component<ToastsViewProps, ToastsViewState> {


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
                        toastView={true}
                        {...toast}
                    />
            ))}
        </div>
    );
  }
}
