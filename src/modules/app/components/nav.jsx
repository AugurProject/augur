import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import classnames from 'classnames';

import Link from 'modules/link/components/link';
import AugurLogoIcon from 'modules/common/components/augur-logo-icon';
import SideBarFilterIcon from 'modules/common/components/side-bar-filter-icon';
import NotificationsContainer from 'modules/notifications/container';

import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, AUTHENTICATION } from 'modules/app/constants/views';
import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-subset';

// NOTE --  first child div is there to pass up a ref so that other methods can
//          acquire the row height of the navs in the footer

export default class Nav extends Component {
  static propTypes = {
    updateIsFooterCollapsed: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      isNotificationsVisible: false,
      notificationIconXOffset: null,
      notificationIconYOffset: null
    };

    this.collapseFooter = this.collapseFooter.bind(this);
    this.setNotificationIconOffeset = this.setNotificationIconOffeset.bind(this);
  }

  componentDidMount() {
    this.setNotificationIconOffeset();
  }

  setNotificationIconOffeset() {
    console.log('### setNotificationIconOffeset -- ', this.notificationBell);
  }

  collapseFooter() {
    if (this.props.updateIsFooterCollapsed) {
      this.props.updateIsFooterCollapsed(true);
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    const animationInSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-fast'), 10);
    const animationOutSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very'), 10);

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
          <button
            className="unstyled button-notifications app-nav-link"
            onClick={() => this.setState({ isNotificationsVisible: !s.isNotificationsVisible })}
          >
            <i
              ref={(notificationBell) => { this.notificationBell = notificationBell; }}
              className="fa fa-bell-o"
            />
          </button>
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
            className={classnames('app-nav-link', TRANSACTIONS, { active: p.activeView === TRANSACTIONS }, { working: p.isTransactionsWorking })}
          >
            <i className="nav-icon fa fa-tasks" />
            {p.numTransactionsWorking ?
              <span className="nav-count">{p.numTransactionsWorking} Transactions Working</span> :
              <span>Transactions</span>
            }
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
        <CSSTransitionGroup
          id="transition_notifications_view"
          transitionName="notifications"
          transitionEnterTimeout={animationInSpeed}
          transitionLeaveTimeout={animationOutSpeed}
        >
          {p.logged && s.isNotificationsVisible &&
            <NotificationsContainer />
          }
        </CSSTransitionGroup>
      </nav>
    );
  }
}
