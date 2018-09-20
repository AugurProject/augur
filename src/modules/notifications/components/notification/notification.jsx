import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";

import { AlertCircle, Close } from "modules/common/components/icons";
import Styles from "modules/notifications/components/notification/notification.styles";
import EtherscanLink from "modules/common/containers/etherscan-link";

export default class Notification extends Component {
  static propTypes = {
    description: PropTypes.string,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    linkPath: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClick: PropTypes.func,
    removeNotification: PropTypes.func.isRequired,
    seen: PropTypes.bool.isRequired,
    timestamp: PropTypes.number,
    title: PropTypes.string.isRequired,
    status: PropTypes.string,
    toggleNotifications: PropTypes.func.isRequired
  };

  render() {
    const {
      id,
      description,
      linkPath,
      onClick,
      removeNotification,
      seen,
      timestamp,
      title,
      toggleNotifications,
      status
    } = this.props;
    return (
      <article
        ref={notification => {
          this.notification = notification;
        }}
        className={classNames(Styles.Notification, {
          [Styles.Notification__seen]: seen
        })}
      >
        <div className={Styles.Notification__column} style={{ flex: "1" }}>
          <Link
            className={Styles.Notification__link}
            to={linkPath || ""}
            onClick={e => {
              e.stopPropagation();
              if (!linkPath) e.preventDefault();
              if (linkPath && onClick) toggleNotifications();
            }}
          >
            <div className={Styles.Notification__row}>
              {AlertCircle(
                !seen
                  ? Styles.Notification__dot
                  : Styles["Notification__dot-seen"],
                "#fff"
              )}
              <div className={Styles.Notification__status}>{status}</div>
            </div>
            <div className={Styles.Notification__row}>
              <span className={Styles.Notification__title}>{title}</span>
            </div>
            {description &&
              description !== "" && (
                <div className={Styles.Notification__row}>
                  <span className={Styles.Notification__description}>
                    {description}
                  </span>
                </div>
              )}
          </Link>
          <div className={Styles.Notification__row}>
            <span className={Styles.Notification__etherLink}>
              <EtherscanLink txhash={id} label="etherscan tx" />
            </span>
            <span className={Styles.Notification__time}>
              &nbsp;— {moment.unix(timestamp).fromNow()}
            </span>
          </div>
        </div>
        <div
          className={Styles.Notification__column}
          style={{ justifyContent: "center" }}
        >
          <div className={Styles.Notification__row}>
            <button
              className={Styles.Notification__close}
              onClick={e => {
                removeNotification();
              }}
            >
              <div className={Styles.Notification__closeButton}>{Close}</div>
            </button>
          </div>
        </div>
      </article>
    );
  }
}
