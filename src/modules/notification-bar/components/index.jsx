import React from 'react'
import PropTypes from 'prop-types'

import makePath from 'modules/routes/helpers/make-path'
import Styles from 'modules/notification-bar/components/notification-bar'
import { CloseWithCircle } from 'src/modules/common/components/icons'
import { Link } from 'modules/common/containers/sticky-params-components'
import { MY_POSITIONS } from 'modules/routes/constants/views'

const numberToWords = require('number-to-words')

export const NotificationBar = ({ dismissFn, notifications, market, marketsNumber }) => notifications.map(notification => (
  <div key={notification.orderId} className={Styles.notificationBar}>
    <div className={Styles.notificationBar_textContainer}>
      <span className={Styles.notificationBar_text}>
        { !market ?
          `You have ${numberToWords.toWords(notifications.length)} orphaned orders across ${numberToWords.toWords(marketsNumber)} ${marketsNumber > 1 ? ' markets' : ' market'}. Please go to your portfolio to cancel these orders.`
          : `You have one orphaned order on market "${market.description}". Please go to your portfolio to cancel this order.`
        }
      </span>
      <span className={Styles.notificationBar_learnMore}>
        <a href="http://docs.augur.net/#orphaned-order" target="_blank" rel="noopener noreferrer">Learn More</a>
      </span>
    </div>
    <button className={Styles.notificationBar_button}>
      <Link to={makePath(MY_POSITIONS)}>
        View Portfolio
      </Link>
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
  market: PropTypes.object,
  marketsNumber: PropTypes.number.isRequired,
}
