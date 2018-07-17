import React from 'react'
import Styles from 'modules/notification-bar/components/notification-bar'
import AppStyles from 'modules/app/components/app/app.styles'

import classNames from 'classnames'

export const NotificationBar = () => (
  <div className={Styles.notificationBar}>Notification
    <div className={classNames(Styles.notificationBar_dismiss, AppStyles.fa, AppStyles['fa-window-close'], AppStyles['fa-3x'])} />
  </div>
)
