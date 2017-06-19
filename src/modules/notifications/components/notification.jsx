import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import debounce from 'utils/debounce';

export default class Notification extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    seen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    removeNotification: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    updateNotification: PropTypes.func.isRequired,
    notificationsBounds: PropTypes.object.isRequired,
    updateNotificationsBoundingBox: PropTypes.func.isRequired,
    checkSeen: PropTypes.bool.isRequired,
    href: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      notificationBounds: {}
    };

    this.updateNotificationBoundingBox = debounce(this.updateNotificationBoundingBox.bind(this), 100);
    this.hasNotificationBeenSeen = this.hasNotificationBeenSeen.bind(this);
  }

  componentDidMount() {
    this.updateNotificationBoundingBox();

    window.addEventListener('scroll', this.updateNotificationBoundingBox);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.notificationBounds !== nextState.notificationBounds) {
      this.props.updateNotificationsBoundingBox();
    }

    if (
      this.props.notificationsBounds !== nextProps.notificationsBounds ||
      this.state.notificationBounds !== nextState.notificationBounds
    ) {
      this.hasNotificationBeenSeen(nextProps.notificationsBounds, nextState.notificationBounds);
    }

    if (this.props.checkSeen !== nextProps.checkSeen && nextProps.checkSeen) {
      this.updateNotificationBoundingBox();
    }

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateNotificationBoundingBox);
  }

  updateNotificationBoundingBox() {
    if (this.notification) this.setState({ notificationBounds: this.notification.getBoundingClientRect() });
  }

  hasNotificationBeenSeen(notificationsBounds, notificationBounds) {
    if (!this.seen && notificationsBounds.top && notificationsBounds.bottom && notificationBounds.top && notificationBounds.bottom) {
      const topBound = notificationsBounds.top;
      const bottomBound = notificationsBounds.bottom;
      const notificationMidpoint = (notificationBounds.top + notificationBounds.bottom) / 2;

      if (
        notificationMidpoint >= topBound &&
        notificationMidpoint <= bottomBound
      ) {
        setTimeout(() => {
          this.props.updateNotification(this.props.index, { seen: true });
        }, 1000);
      }
    }
  }

  render() {
    const p = this.props;

    return (
      <article
        ref={(notification) => {
          this.notification = notification;
        }}
        className={classNames('notification', { 'notification-unseen': !p.seen })}
      >
        <button
          className={classNames('unstyled notification-details', { navigational: !!p.onClick })}
          onClick={(e) => {
            e.stopPropagation();

            if (p.onClick) {
              p.onClick(p.href);
              p.toggleNotifications();
            }
          }}
        >
          <span className="notification-title">{p.title}</span>
          <span className="notification-description">{p.description}</span>
        </button>
        <button
          className="unstyled notification-remove"
          onClick={(e) => {
            e.stopPropagation();
            p.removeNotification(p.notificationIndex);
          }}
        >
          <i className="fa fa-close" />
        </button>
      </article>
    );
  }
}
