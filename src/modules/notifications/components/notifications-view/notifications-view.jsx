import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import Notification from "modules/notifications/components/notification/notification";
import toggleHeight from "utils/toggle-height/toggle-height";

import { Close } from "modules/common/components/icons";

import Styles from "modules/notifications/components/notifications-view/notifications-view.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export default class NotificationsView extends Component {
  static propTypes = {
    notifications: PropTypes.array.isRequired,
    updateNotification: PropTypes.func.isRequired,
    removeNotification: PropTypes.func.isRequired,
    clearNotifications: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    notificationsVisible: PropTypes.bool.isRequired
  };

  componentWillUpdate(nextProps) {
    if (!this.props.notificationsVisible && nextProps.notificationsVisible) {
      toggleHeight(this.notificationsContainer, false, () => {});
    } else if (
      this.props.notificationsVisible &&
      !nextProps.notificationsVisible
    ) {
      toggleHeight(this.notificationsContainer, true, () => {});

      const { updateNotification, notifications } = this.props;
      notifications.forEach(notification => {
        updateNotification(notification.id, { seen: true });
      });
    }
  }

  render() {
    const {
      removeNotification,
      toggleNotifications,
      clearNotifications,
      notifications
    } = this.props;

    return (
      <div
        ref={notificationsContainer => {
          this.notificationsContainer = notificationsContainer;
        }}
        className={classNames(
          Styles.NotificationsView__parent,
          ToggleHeightStyles["toggle-height-target"],
          ToggleHeightStyles["toggle-height-target-quick"]
        )}
      >
        <section
          id="notifications_view"
          className={classNames(Styles.NotificationsView, {
            [Styles.NotificationsView__dark]: !(
              notifications && notifications.length
            )
          })}
        >
          <button
            className={Styles.Notification__close}
            onClick={e => {
              e.stopPropagation();
              toggleNotifications();
            }}
          >
            {Close}
          </button>
          {notifications && notifications.length ? (
            <div
              ref={notifications => {
                this.notifications = notifications;
              }}
              className={Styles.NotificationsView__box}
            >
              {notifications.map((notification, i) => (
                <Notification
                  key={`${notification.id}-${notification.title}`}
                  removeNotification={() => removeNotification(notification.id)}
                  toggleNotifications={toggleNotifications}
                  {...notification}
                />
              ))}
            </div>
          ) : (
            <NullStateMessage
              className={Styles.NullStateMessage}
              message="No Notifications"
            />
          )}
          {notifications && notifications.length ? (
            <div className={Styles.NotificationsView__dismissContainer}>
              <div className={Styles.NotificationsView__dismissContainerBorder}>
                <div
                  className={Styles.NotificationsView__dismissButton}
                  onClick={clearNotifications}
                  role="button"
                  tabIndex="0"
                >
                  Dismiss All
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    );
  }
}
