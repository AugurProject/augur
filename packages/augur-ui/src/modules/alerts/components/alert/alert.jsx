import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";

import { Close } from "modules/common/components/icons";
import Styles from "modules/alerts/components/alert/alert.styles";
import EtherscanLink from "modules/common/containers/etherscan-link";

export default class Alert extends Component {
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
          [Styles.Alert__seen]: seen
        })}
      >
        <div className={Styles.Alert__column} style={{ flex: "1" }}>
          <Link
            className={Styles.Alert__link}
            to={linkPath || ""}
            onClick={e => {
              e.stopPropagation();
              if (!linkPath) e.preventDefault();
              if (linkPath && onClick) toggleAlerts();
            }}
          >
            <div className={Styles.Alert__row}>
              <div className={Styles.Alert__status}>{status}</div>
            </div>
            <div className={Styles.Alert__row}>
              <span className={Styles.Alert__title}>{title}</span>
            </div>
            {description &&
              description !== "" && (
                <div className={Styles.Alert__row}>
                  <span className={Styles.Alert__description}>
                    {description}
                  </span>
                </div>
              )}
          </Link>
          <div className={Styles.Alert__row}>
            <span className={Styles.Alert__etherLink}>
              <EtherscanLink txhash={id} label="etherscan tx" />
            </span>
            <span className={Styles.Alert__time}>
              &nbsp;— {moment.unix(timestamp).fromNow()}
            </span>
          </div>
        </div>
        <div
          className={Styles.Alert__column}
          style={{ justifyContent: "center" }}
        >
          <div className={Styles.Alert__row}>
            <button
              className={Styles.Alert__close}
              onClick={e => {
                removeAlert();
              }}
            >
              <div className={Styles.Alert__closeButton}>{Close}</div>
            </button>
          </div>
        </div>
      </article>
    );
  }
}
