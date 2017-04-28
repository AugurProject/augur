import React, { PropTypes } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import NullStateMessage from 'modules/common/components/null-state-message';
import Notification from 'modules/notifications/components/notification';

import getValue from 'utils/get-value';

const NotificationsView = (p) => {
  const notifications = getValue(p, 'notifications.notifications');

  const animationInSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-normal'), 10);
  const animationOutSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-fast'), 10);

  return (
    <section id="notifications_view" >
      <h3>Notifications</h3>
      {notifications && notifications.length ?
        <CSSTransitionGroup
          transitionName="notification"
          transitionEnterTimeout={animationInSpeed}
          transitionLeaveTimeout={animationOutSpeed}
        >
          {notifications.map(notification => (
            <Notification
              key={`${notification.id}-${notification.title}`}
              {...notification}
            />
          ))}
        </CSSTransitionGroup> :
        <NullStateMessage message="No Notifications" />
      }
    </section>
  );
};

NotificationsView.propTypes = {
  notifications: PropTypes.object.isRequired
};

export default NotificationsView;
