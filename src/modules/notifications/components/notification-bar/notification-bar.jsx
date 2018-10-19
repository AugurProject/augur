import React from "react";
import PropTypes from "prop-types";

import makePath from "modules/routes/helpers/make-path";
import Styles from "modules/notifications/components/notification-bar/notification-bar.styles";
import { CloseWithCircle } from "src/modules/common/components/icons";
import { Link } from "react-router-dom";
import { MY_POSITIONS } from "modules/routes/constants/views";

const numberToWords = require("number-to-words");

export const NotificationBar = ({
  dismissFn,
  notifications,
  market,
  marketsNumber
}) =>
  notifications.map(notification => (
    <div key={notification.orderId} className={Styles.notificationBar}>
      <div className={Styles.notificationBar_textContainer}>
        <span className={Styles.notificationBar_text}>
          {!market
            ? `You have ${numberToWords.toWords(
                notifications.length
              )} orphaned orders across ${numberToWords.toWords(
                marketsNumber
              )} ${
                marketsNumber > 1 ? " markets" : " market"
              }. Please go to your portfolio to cancel these orders.`
            : `You have one orphaned order on market "${
                market.description
              }". Please go to your portfolio to cancel this order.`}
        </span>
        <span className={Styles.notificationBar_learnMore}>
          <a
            href="http://docs.augur.net/#orphaned-order"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </span>
      </div>
      <div className={Styles.notificationBar_container}>
        <Link
          to={makePath(MY_POSITIONS)}
          className={Styles.notificationBar_button}
        >
          View Portfolio
        </Link>
      </div>
      <div className={Styles.notificationBar_container}>
        <button
          className={Styles.notificationBar_dismiss}
          onClick={() => dismissFn(notification)}
        >
          <div className={Styles.notificationBar_dismissIcon}>
            {CloseWithCircle(
              Styles.notificationBar_dismissIconImg,
              "#412468",
              "#FFF"
            )}
          </div>
        </button>
      </div>
    </div>
  ));

NotificationBar.propTypes = {
  dismissFn: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.object),
  market: PropTypes.object,
  marketsNumber: PropTypes.number.isRequired
};

NotificationBar.defaultProps = {
  market: null,
  notifications: []
};
