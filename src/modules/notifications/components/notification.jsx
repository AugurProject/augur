import React, { PropTypes } from 'react';

const Notification = p => (
  <article className="notification">
    <button
      className="unstyled notification-details"
      onClick={(e) => {
        e.stopPropagation();
        if (p.onClick) p.onClick();
        console.log('hery');
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
        console.log('close!');
      }}
    >
      <i className="fa fa-close" />
    </button>
  </article>
);

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  removeNotification: PropTypes.func.isRequired
};

export default Notification;
