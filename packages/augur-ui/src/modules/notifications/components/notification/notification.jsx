import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";

import { AlertCircle, CloseWithCircle } from "modules/common/components/icons";
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

  showOnMouseEnterIcon() {
    this.notificationCloseButton.className =
      Styles.Notification__closeButtonHidden;
    this.notificationCloseButtonHover.className =
      Styles.Notification__closeButton;
  }

  showOnMouseLeaveIcon() {
    this.notificationCloseButton.className = Styles.Notification__closeButton;
    this.notificationCloseButtonHover.className =
      Styles.Notification__closeButtonHidden;
  }

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
        className={Styles.Notification}
      >
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
              "#553580"
            )}
            <div className={Styles.Notification__status}>{status}</div>
          </div>
          <div className={Styles.Notification__row}>
            <span className={Styles.Notification__title}>{title}</span>
            <button
              className={Styles.Notification__close}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                removeNotification();
              }}
              onMouseEnter={() => {
                this.showOnMouseEnterIcon();
              }}
              onMouseLeave={() => {
                this.showOnMouseLeaveIcon();
              }}
            >
              <div
                ref={notificationCloseButton => {
                  this.notificationCloseButton = notificationCloseButton;
                }}
                className={Styles.Notification__closeButton}
              >
                {CloseWithCircle("", "#DBDAE1", "#FFF")}
              </div>
              <div
                ref={notificationCloseButtonHover => {
                  this.notificationCloseButtonHover = notificationCloseButtonHover;
                }}
                className={Styles.Notification__closeButtonHidden}
              >
                {CloseWithCircle("", "#412468", "#FFF")}
              </div>
            </button>
          </div>
          {description &&
            description !== "" && (
              <span className={Styles.Notification__description}>
                {description}
              </span>
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
      </article>
    );
  }
}
