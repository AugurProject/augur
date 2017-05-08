import React, { Component, PropTypes } from 'react';
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
    this.props.updateNotificationsBoundingBox();
    this.updateNotificationBoundingBox();

    window.addEventListener('scroll', this.updateNotificationBoundingBox);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.notificationsBounds !== nextProps.notificationsBounds ||
      this.state.notificationBounds !== nextState.notificationBounds
    ) {
      this.hasNotificationBeenSeen(nextProps.notificationsBounds, nextState.notificationBounds);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateNotificationBoundingBox);
  }

  updateNotificationBoundingBox() {
    if (this.notification) this.setState({ notificationBounds: this.notification.getBoundingClientRect() });
  }

  hasNotificationBeenSeen(notificationsBounds, notificationBounds) {
    const topBound = notificationsBounds.top;
    const bottomBound = notificationsBounds.bottom;
    const notificationMidpoint = (notificationBounds.top + notificationBounds.bottom) / 2;
    if (!this.seen) {
      if (
        notificationMidpoint <= topBound ||
        notificationMidpoint >= bottomBound
      ) {
        console.log('has been seen');
        this.props.updateNotification(this.props.index, { seen: true });
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
        className="notification"
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
