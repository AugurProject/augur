/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance since the order NEVER changes
// comment lifted from old core-stats.js
import React from 'react'
import PropTypes from 'prop-types'

import { Notifications } from 'modules/common/components/icons/icons'
import NotificationsContainer from 'modules/notifications/container'

import Styles from 'modules/app/components/top-bar/top-bar.styles'

const TopBar = props => (
  <header className={Styles.TopBar}>
    {props.isLogged &&
      <section>
        <span className={Styles.TopBar__stat}>
          <span className={Styles['TopBar__stat-label']}>ETH</span>
          <span className={Styles['TopBar__stat-value']}>
            {props.stats[0].totalRealEth.value.formatted}
          </span>
        </span>
        <span className={Styles.TopBar__stat}>
          <span className={Styles['TopBar__stat-label']}>REP</span>
          <span className={Styles['TopBar__stat-value']}>
            {props.stats[0].totalRep.value.formatted}
          </span>
        </span>
        <div className={Styles.TopBar__notifications}>
          <button
            className={Styles['TopBar__notification-icon']}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              props.toggleNotifications()
            }}
          >
            {Notifications(props.unseenCount)}
          </button>
          {props.isLogged && props.isNotificationsVisible &&
            <NotificationsContainer
              toggleNotifications={() => props.toggleNotifications()}
            />
          }
        </div>
      </section>
    }
    <span className={Styles['TopBar__logo-text']}>Augur</span>
  </header>
)

TopBar.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  stats: PropTypes.array.isRequired,
  unseenCount: PropTypes.number.isRequired,
  isNotificationsVisible: PropTypes.bool.isRequired,
  toggleNotifications: PropTypes.func.isRequired,
  notifications: PropTypes.object
}

export default TopBar
