import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { Notifications } from 'modules/common/components/icons'
import makePath from 'modules/routes/helpers/make-path'
import { CATEGORIES } from 'modules/routes/constants/views'
import Styles from 'modules/app/components/top-bar/top-bar.styles'

const TopBar = props => (
  <header className={Styles.TopBar}>
    {props.isLogged &&
      <div>
        <div className={Styles.TopBar__stats}>
          <div className={Styles.TopBar__stat}>
            <span className={Styles['TopBar__stat-label']}>ETH</span>
            <span className={Styles['TopBar__stat-value']}>
              {props.stats[0].totalRealEth.value.formatted}
            </span>
          </div>
          <div className={Styles.TopBar__stat}>
            <span className={Styles['TopBar__stat-label']}>REP</span>
            <span className={Styles['TopBar__stat-value']}>
              {props.stats[0].totalRep.value.formatted}
            </span>
          </div>
        </div>
        <div className={classNames(Styles.TopBar__stats, Styles.TopBar__performance)}>
          <div className={Styles.TopBar__stat}>
            <div
              className={Styles['TopBar__stat-label']}
            >
              <span>{props.stats[1].totalPLMonth.label}</span>
            </div>
            <span className={Styles['TopBar__stat-value']}>
              {props.stats[1].totalPLMonth.value.formatted} ETH
            </span>
          </div>
          <div className={Styles.TopBar__stat}>
            <div
              className={Styles['TopBar__stat-label']}
            >
              <span>{props.stats[1].totalPLDay.label}</span>
            </div>
            <span className={Styles['TopBar__stat-value']}>
              {props.stats[1].totalPLDay.value.formatted} ETH
            </span>
          </div>
        </div>
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
        </div>
      </div>
    }
    <span className={Styles['TopBar__logo-text']}>
      <Link to={makePath(CATEGORIES)}>Augur</Link>
    </span>
  </header>
)

TopBar.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  stats: PropTypes.array.isRequired,
  unseenCount: PropTypes.number.isRequired,
  toggleNotifications: PropTypes.func.isRequired,
}

export default TopBar
