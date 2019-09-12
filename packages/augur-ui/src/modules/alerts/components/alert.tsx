import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";

import { Close } from "modules/common/icons";
import Styles from "modules/alerts/components/alert.styles.less";
import { EtherscanLink } from "modules/common/buttons";

interface AlertProps {
  id: string;
  title: string;
  description?: string;
  details?: string;
  linkPath?: string | any;
  onClick?: Function;
  removeAlert: Function;
  seen: boolean;
  timestamp: number;
  status: string;
  toggleAlerts: Function;
  toastView?: boolean;
}

interface AlertState {
  show: boolean;
}

export default class Alert extends Component<AlertProps, AlertState> {
  state: AlertState = {
    show: true
  };

  componentDidMount() {
    this.timeout = setInterval(() => this.props.toastView && this.setState({ show: false}), 2000);
  }
  componentWillUnmount() {
    clearInterval(this.timeout);
  }
  render() {
    const {
      id,
      details,
      description,
      removeAlert,
      seen,
      timestamp,
      title,
      toastView
    } = this.props;

    if (toastView && !this.state.show) return null;
    return (
      <article
        className={classNames(Styles.Alert, {
          [Styles.Seen]: seen
        })}
      >
        <div>
            <div className={Styles.Row}>
              <div className={Styles.Status}>{title}</div>
            </div>
            <div className={Styles.Row}>
              <span className={Styles.Title}>{description}</span>
            </div>
            {description &&
              description !== "" && (
                <div className={Styles.Row}>
                  <span className={Styles.Description}>
                    {details}
                  </span>
                </div>
              )}
          <div className={Styles.Row}>
            <span className={Styles.EtherLink}>
              <EtherscanLink txhash={id} label="view etherscan" />
            </span>
          </div>
        </div>
        <div>
          <div className={Styles.Row}>
            <button
              className={Styles.Close}
              onClick={e => {
                removeAlert();
              }}
            >
              {Close}
            </button>
          </div>
        </div>
      </article>
    );
  }
}
