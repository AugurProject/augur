import React, { PropTypes } from 'react';

const Notification = p => (
  <button
    className="unstyled notification"
    onClick={(e) => {
      e.stopPropagation();
      if (p.onClick) p.onClick();
      console.log('hery');
    }}
  >
    <span className="notification-title">{p.title}</span>
    <span className="notification-description">{p.description}</span>
    <button
      className="unstyled"
      onClick={(e) => {
        e.stopPropagation();
        p.removeNotification(p.notificationIndex);
        console.log('close!');
      }}
    >
      <i className="fa fa-close" />
    </button>
  </button>
);

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  removeNotification: PropTypes.func.isRequired
};

export default Notification;
