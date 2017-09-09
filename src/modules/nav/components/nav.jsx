import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import AugurLogoIcon from 'modules/common/components/augur-logo-icon/augur-logo-icon'
import SideBarFilterIcon from 'modules/common/components/side-bar-filter-icon'
import NotificationsContainer from 'modules/notifications/container'

import getValue from 'utils/get-value'

import makePath from 'modules/routes/helpers/make-path'

import * as VIEWS from 'modules/routes/constants/views'

// NOTE --  first child div is there to pass up a ref so that other methods can
//          acquire the row height of the navs in the footer
export default class Nav extends Component {
  static propTypes = {
    isLogged: PropTypes.bool,
    updateIsFooterCollapsed: PropTypes.func,
    notifications: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      isNotificationsVisible: false
    }

    this.collapseFooter = this.collapseFooter.bind(this)
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this)
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowOnClick)
  }

  collapseFooter() {
    if (this.props.updateIsFooterCollapsed) {
      this.props.updateIsFooterCollapsed(true)
    }
  }

  handleWindowOnClick() {
    // Can generalize this later if more nav modals are needed
    if (this.state.isNotificationsVisible) {
      this.setState({ isNotificationsVisible: false })
    }
  }

  toggleNotifications() {
    this.setState({ isNotificationsVisible: !this.state.isNotificationsVisible })
  }

  render() {
    const p = this.props
    const s = this.state

    const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-fast'), 10)

    const unseenCount = getValue(p, 'notifications.unseenCount')

    return (
      <nav className={`app-nav ${p.className ? p.className : ''}`}>
        <div ref={p.navRef && p.navRef} />
        {p.isSideBarAllowed && !p.isSideBarPersistent &&
          <button
            className="app-nav-link unstyled"
            onClick={p.toggleSideBar}
          >
            {p.isSideBarCollapsed ? <SideBarFilterIcon /> : <i className="fa fa-remove" />}
          </button>
        }
        <div className="augur-brand">
          <Link to={makePath(VIEWS.DEFAULT_VIEW)} >
            <AugurLogoIcon />
          </Link>
        </div>
        <NavLink
          to={makePath(VIEWS.MARKETS)}
          activeClassName="active"
          className="link app-nav-link"
          onClick={() => this.collapseFooter()}
        >
          <i className="nav-icon fa fa-line-chart" />
          Markets
        </NavLink>
        {p.isLogged && !!p.numFavorites &&
          <NavLink
            to={makePath(VIEWS.FAVORITES)}
            activeClassName="active"
            onClick={() => this.collapseFooter()}
            className="link app-nav-link"
          >
            <i className="nav-icon fa fa-star" />
            <span className="nav-count">{p.numFavorites} </span>
            Favorites
          </NavLink>
        }
        {p.isLogged && !!p.numPendingReports &&
          <NavLink
            to={makePath(VIEWS.MY_REPORTS)}
            activeClassName="active"
            onClick={() => this.collapseFooter()}
            className="link app-nav-link"
          >
            <i className="nav-icon fa fa-copy" />
            <span className="nav-count">{p.numPendingReports} </span>
            Pending Reports
          </NavLink>
        }
        {p.isLogged &&
          <NavLink
            to={makePath(VIEWS.MY_POSITIONS)}
            activeClassName="active"
            isActive={(match, location) => {
              if (match) return true

              return [VIEWS.MY_MARKETS, VIEWS.MY_REPORTS].find(path => makePath(path) === location.pathname)
            }}
            onClick={() => this.collapseFooter()}
            className={'link app-nav-link'}
          >
            <i className="nav-icon fa fa-money" />
            Portfolio
          </NavLink>
        }
        {p.isLogged &&
          <NavLink
            to={makePath(VIEWS.TRANSACTIONS)}
            activeClassName="active"
            onClick={() => this.collapseFooter()}
            className={'link app-nav-link'}
          >
            <i className="nav-icon fa fa-tasks" />
            Transactions
          </NavLink>
        }
        {p.isLogged &&
          <NavLink
            to={makePath(VIEWS.ACCOUNT)}
            activeClassName="active"
            className={'link app-nav-link'}
            onClick={() => this.collapseFooter()}
          >
            <i className="nav-icon fa fa-cog" />
            Account
          </NavLink>
        }
        {!p.isLogged &&
          <NavLink
            to={makePath(VIEWS.AUTHENTICATION)}
            activeClassName="active"
            className={'link app-nav-link'}
            onClick={() => this.collapseFooter()}
          >
            <div className="nav-icon-google-translate-fix">
              <i className="nav-icon">
                <AugurLogoIcon />
              </i>
            </div>
            Sign Up / Login
          </NavLink>
        }
        {p.isLogged &&
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            className="modal-link"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <button
              ref={(notificationIcon) => { this.notificationIcon = notificationIcon }}
              className="unstyled button-notifications app-nav-link"
              onClick={(e) => {
                e.stopPropagation()
                this.toggleNotifications()
              }}
            >
              {s.isNotificationsVisible ?
                <i className="fa fa-bell" /> :
                <i className="fa fa-bell-o" />
              }
              <CSSTransitionGroup
                transitionName="unseen-count"
                transitionEnterTimeout={animationSpeed}
                transitionLeaveTimeout={animationSpeed}
              >
                {!!unseenCount &&
                  <span className="unseen-count">{unseenCount}</span>
                }
              </CSSTransitionGroup>
            </button>
            <CSSTransitionGroup
              id="transition_notifications_view"
              transitionName="notifications"
              transitionEnterTimeout={animationSpeed}
              transitionLeaveTimeout={animationSpeed}
            >
              {p.isLogged && s.isNotificationsVisible &&
                <span id="notifications_arrow_up" />
              }
              {p.isLogged && s.isNotificationsVisible &&
                <NotificationsContainer
                  toggleNotifications={() => this.toggleNotifications()}
                />
              }
            </CSSTransitionGroup>
          </div>
        }
      </nav>
    )
  }
}
