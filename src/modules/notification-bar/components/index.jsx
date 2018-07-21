import React from 'react'
import Styles from 'modules/notification-bar/components/notification-bar'

import classNames from 'classnames'

export const NotificationBar = () => (
  <div className={Styles.notificationBar}>
    <div className={Styles.notificationBar_textContainer}>
      <p className={Styles.notificationBar_text}>
	  		Je déteste faire du sport, cependant je vais à tout mes entraînements. J'en ai besoin parce que la vie Américaine m'a transformé
      </p>
    </div>
    <div className={Styles.notificationBar_button}>
  		SIGN TRANSACTION
    </div>
    <div className={Styles.notificationBar_dismiss}>
  		Dismiss
      <div className={Styles.notificationBar_dismissIcon}>
        <img
          className={Styles.notificationBar_dismissIconImg}
          alt="Alert"
          src="../../assets/images/augur-logo.svg"
        />
      </div>
    </div>
  </div>
)
