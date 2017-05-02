import React, { PropTypes } from 'react';

const Notification = p => (
  <article className="notification">
    <button
      className="unstyled notification-details"
      onClick={(e) => {
        e.stopPropagation();
        console.log('p -- ', p);
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

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  removeNotification: PropTypes.func.isRequired,
  toggleNotifications: PropTypes.func.isRequired,
  href: PropTypes.string
};

export default Notification;
