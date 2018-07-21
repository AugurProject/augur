import React from 'react'
import Styles from 'modules/notification-bar/components/notification-bar'
import { CloseWithCircle } from 'src/modules/common/components/icons'

export const NotificationBar = () => (
  <div className={Styles.notificationBar}>
    <div className={Styles.notificationBar_textContainer}>
      <p className={Styles.notificationBar_text}>
        {'blashdjhhajkdhsjkdhshj dshjkshdsdd dsdhsdd dhdhhd sgsgsg. ddsdsjdhsd'}
      </p>
    </div>
    <div className={Styles.notificationBar_button}>
        SIGN TRANSACTION
    </div>
    <div className={Styles.notificationBar_dismiss}>
      Dismiss
      <div className={Styles.notificationBar_dismissIcon}>
        <CloseWithCircle />
      </div>
    </div>
  </div>
)
