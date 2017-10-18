/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance since the order NEVER changes
// comment lifted from old core-stats.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import getValue from 'utils/get-value'

import NotificationsContainer from 'modules/notifications/container'

import Styles from 'modules/app/components/top-bar/top-bar.styles'

class TopBar extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    stats: PropTypes.array.isRequired,
    notifications: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      isNotificationsVisible: false
    }
  }

  toggleNotifications() {
    this.setState({ isNotificationsVisible: !this.state.isNotificationsVisible })
  }

  render() {
    const p = this.props
    const s = this.state
    console.log(p)
    // const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-fast'), 10)
    const unseenCount = getValue(p, 'notifications.unseenCount')
    // const unseenCount = 1
    // {s.isNotificationsVisible ?
    //   <i className={Styles['TopBar__notifications-bell']} /> :
    //   <i className={Styles['TopBar__notifications-bell-o']} />
    // }
    return (
      <header className={Styles.TopBar}>
        {p.isLogged &&
          <section>
            <span className={Styles.TopBar__stat}>
              <span className={Styles['TopBar__stat-label']}>ETH</span>
              <span className={Styles['TopBar__stat-value']}>
                {p.stats[0].totalRealEth.value.formatted}
              </span>
            </span>
            <span className={Styles.TopBar__stat}>
              <span className={Styles['TopBar__stat-label']}>REP</span>
              <span className={Styles['TopBar__stat-value']}>
                {p.stats[0].totalRep.value.formatted}
              </span>
            </span>
            <div className={s.isNotificationsVisible ? Styles['TopBar__notifications-visible'] : Styles.TopBar__notifications}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  this.toggleNotifications()
                }}
              >
                {s.isNotificationsVisible ?
                  <i className="fa fa-bell" /> :
                  <i className="fa fa-bell-o" />
                }
                {!!unseenCount &&
                  <span className={Styles['unseen-count']}>{unseenCount}</span>
                }
              </button>
              {p.isLogged && s.isNotificationsVisible &&
                <NotificationsContainer
                  toggleNotifications={() => this.toggleNotifications()}
                />
              }
            </div>
          </section>
        }
        <span className={Styles['TopBar__logo-text']}>Augur</span>
      </header>
    )
  }
}
// <CSSTransitionGroup
//   transitionName="unseen-count"
//   transitionEnterTimeout={animationSpeed}
//   transitionLeaveTimeout={animationSpeed}
// >
//   {!!unseenCount &&
//     <span className="unseen-count">{unseenCount}</span>
//   }
// </CSSTransitionGroup>
// <CSSTransitionGroup
//   id="transition_notifications_view"
//   transitionName="notifications"
//   transitionEnterTimeout={animationSpeed}
//   transitionLeaveTimeout={animationSpeed}
// >
// </CSSTransitionGroup>

// {p.isLogged && s.isNotificationsVisible &&
//   <span id="notifications_arrow_up" />
// }

export default TopBar
