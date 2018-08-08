import React from 'react'
import Styles from 'modules/notification-bar/components/notification-bar'
import { CloseWithCircle } from 'src/modules/common/components/icons'
import PropTypes from 'prop-types'

export const NotificationBar = ({ actionFn, dismissFn, notifications }) => notifications.map(notification => (
  <div key={notification.orderId} className={Styles.notificationBar}>
    <div className={Styles.notificationBar_textContainer}>
      <span className={Styles.notificationBar_text}>
        You have {notifications.length} orphaned order{notifications.length > 1 ? `s` : ''}. Please click to cancel.
      </span>
      <span className={Styles.notificationBar_learnMore}>
        <a href="http://docs.augur.net/#orphaned-order" target="_blank" rel="noopener noreferrer">Learn More</a>
      </span>
    </div>
    <button className={Styles.notificationBar_button} onClick={() => actionFn(notification)}>
      Cancel orphaned order
    </button>
    <button className={Styles.notificationBar_dismiss} onClick={() => dismissFn(notification)}>
      <div className={Styles.notificationBar_dismissIcon}>
        <CloseWithCircle />
      </div>
    </button>
  </div>))

NotificationBar.propTypes = {
  cancelOrder: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.object),
}
