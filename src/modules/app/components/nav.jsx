import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import classnames from 'classnames';

import Link from 'modules/link/components/link';
import AugurLogoIcon from 'modules/common/components/augur-logo-icon';
import SideBarFilterIcon from 'modules/common/components/side-bar-filter-icon';
import NotificationsContainer from 'modules/notifications/container';

import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, AUTHENTICATION } from 'modules/app/constants/views';
import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-subset';

import getValue from 'utils/get-value';

// NOTE --  first child div is there to pass up a ref so that other methods can
//          acquire the row height of the navs in the footer
export default class Nav extends Component {
  static propTypes = {
    logged: PropTypes.string,
    updateIsFooterCollapsed: PropTypes.func,
    notifications: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      isNotificationsVisible: false
    };

    this.collapseFooter = this.collapseFooter.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowOnClick);
  }

  collapseFooter() {
    if (this.props.updateIsFooterCollapsed) {
      this.props.updateIsFooterCollapsed(true);
    }
  }

  handleWindowOnClick() {
    // Can generalize this later if more nav modals are needed
    if (this.state.isNotificationsVisible) {
      this.setState({ isNotificationsVisible: false });
    }
  }

  toggleNotifications() {
    this.setState({ isNotificationsVisible: !this.state.isNotificationsVisible });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-fast'), 10);

    const unseenCount = getValue(p, 'notifications.unseenCount');

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
          <Link {...p.topicsLink} >
            <AugurLogoIcon />
          </Link>
        </div>
        {p.logged &&
          <div
            className="modal-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              ref={(notificationIcon) => { this.notificationIcon = notificationIcon; }}
              className="unstyled button-notifications app-nav-link"
              onClick={(e) => {
                e.stopPropagation();
                this.toggleNotifications();
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
              {p.logged && s.isNotificationsVisible &&
                <span id="notifications_arrow_up" />
              }
              {p.logged && s.isNotificationsVisible &&
                <NotificationsContainer
                  toggleNotifications={() => this.toggleNotifications()}
                />
              }
            </CSSTransitionGroup>
          </div>
        }
        <Link
          {...p.allMarketsLink}
          onClick={() => {
            p.allMarketsLink.onClick();
            this.collapseFooter();
          }}
          className={classnames('app-nav-link', { active: ((p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader == null) })}
        >
          <i className="nav-icon fa fa-line-chart" />
          Markets
        </Link>
        {p.logged && !!p.numFavorites &&
          <Link
            {...p.favoritesLink}
            onClick={() => {
              p.favoritesLink.onClick();
              this.collapseFooter();
            }}
            className={classnames('app-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === FAVORITES })}
          >
            <i className="nav-icon fa fa-star" />
            <span className="nav-count">{p.numFavorites} </span>
            Favorites
          </Link>
        }
        {p.logged && !!p.numPendingReports &&
          <Link
            {...p.pendingReportsLink}
            onClick={() => {
              p.pendingReportsLink.onClick();
              this.collapseFooter();
            }}
            className={classnames('app-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === PENDING_REPORTS })}
          >
            <i className="nav-icon fa fa-copy" />
            <span className="nav-count">{p.numPendingReports} </span>
            Pending Reports
          </Link>
        }
        {p.logged && !!p.portfolioTotals &&
          <Link
            {...p.myPositionsLink}
            onClick={() => {
              p.myPositionsLink.onClick();
              this.collapseFooter();
            }}
            className={classnames('app-nav-link', MY_POSITIONS, { active: [MY_POSITIONS, MY_MARKETS, MY_REPORTS].indexOf(p.activeView) > -1 })}
          >
            <i className="nav-icon fa fa-money" />
            Portfolio
          </Link>
        }
        {p.logged &&
          <Link
            {...p.transactionsLink}
            onClick={() => {
              p.transactionsLink.onClick();
              this.collapseFooter();
            }}
            className={classnames('app-nav-link', TRANSACTIONS, { active: p.activeView === TRANSACTIONS })}
          >
            <i className="nav-icon fa fa-tasks" />
            Transactions
          </Link>
        }
        {p.logged &&
          <Link
            {...p.accountLink}
            onClick={() => {
              p.accountLink.onClick();
              this.collapseFooter();
            }}
            className={classnames('app-nav-link', ACCOUNT, { active: p.activeView === ACCOUNT })}
          >
            <i className="nav-icon fa fa-cog" />
            Account
          </Link>
        }
        {!p.logged &&
          <Link
            {...p.authLink}
            onClick={() => {
              p.authLink.onClick();
              this.collapseFooter();
            }}
            className={classnames('app-nav-link', AUTHENTICATION, { active: p.activeView === AUTHENTICATION })}
          >
            <div className="nav-icon-google-translate-fix">
              <i className="nav-icon">
                <AugurLogoIcon />
              </i>
            </div>
            Sign Up / Login
          </Link>
        }
      </nav>
    );
  }
}
