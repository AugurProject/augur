import React, { PropTypes } from 'react';

const Notification = p => (
  <article className="notification">
    <span className="notification-title">{p.title}</span>
    <span className="notification-description">{p.description}</span>
  </article>
);

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default Notification;
