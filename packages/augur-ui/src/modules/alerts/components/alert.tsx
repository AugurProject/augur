import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";

import { Close } from "modules/common/components/icons";
import Styles from "modules/alerts/components/alert.styles";
import EtherscanLink from "modules/common/containers/etherscan-link";

interface AlertProps {
  id: String;
  description?: String;
  linkPath?: String | any;
  onClick?: Function;
  removeAlert: Function;
  seen: Boolean;
  timestamp?: Number;
  title: String;
  status: String;
  toggleAlerts: Function;
}

export default class Alert extends Component<AlertProps> {
  static propTypes = {
    description: PropTypes.string,
    id: PropTypes.string.isRequired,
    linkPath: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClick: PropTypes.func,
    removeAlert: PropTypes.func.isRequired,
    seen: PropTypes.bool.isRequired,
    timestamp: PropTypes.number,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    toggleAlerts: PropTypes.func.isRequired
  };

  alert: any = null;

  static defaultProps = {
    description: "",
    linkPath: null,
    onClick: null,
    timestamp: null
  };

  render() {
    const {
      id,
      description,
      linkPath,
      onClick,
      removeAlert,
      seen,
      timestamp,
      title,
      toggleAlerts,
      status
    } = this.props;
    return (
      <article
        ref={alert => {
          this.alert = alert;
        }}
        className={classNames(Styles.Alert, {
          [Styles.Seen]: seen
        })}
      >
        <div className={Styles.Column} style={{ flex: "1" }}>
          <Link
            className={Styles.Link}
            to={linkPath || ""}
            onClick={e => {
              e.stopPropagation();
              if (!linkPath) e.preventDefault();
              if (linkPath && onClick) toggleAlerts();
            }}
          >
            <div className={Styles.Row}>
              <div className={Styles.Status}>{status}</div>
            </div>
            <div className={Styles.Row}>
              <span className={Styles.Title}>{title}</span>
            </div>
            {description &&
              description !== "" && (
                <div className={Styles.Row}>
                  <span className={Styles.Description}>
                    {description}
                  </span>
                </div>
              )}
          </Link>
          <div className={Styles.Row}>
            <span className={Styles.EtherLink}>
              <EtherscanLink txhash={id} label="etherscan tx" />
            </span>
            <span className={Styles.Time}>
              &nbsp;— {moment.unix(timestamp).fromNow()}
            </span>
          </div>
        </div>
        <div
          className={Styles.Column}
          style={{ justifyContent: "center" }}
        >
          <div className={Styles.Row}>
            <button
              className={Styles.Close}
              onClick={e => {
                removeAlert();
              }}
            >
              <div className={Styles.CloseButton}>{Close}</div>
            </button>
          </div>
        </div>
      </article>
    );
  }
}
