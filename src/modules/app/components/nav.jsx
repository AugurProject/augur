import React from 'react';

import classnames from 'classnames';

import Link from 'modules/link/components/link';
import AugurLogoIcon from 'modules/common/components/augur-logo-icon';
import SideBarFilterIcon from 'modules/common/components/side-bar-filter-icon';

import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, AUTHENTICATION } from 'modules/app/constants/views';
import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-subset';

// NOTE --  first child div is there to pass up a ref so that other methods can
//          acquire the row height of the navs in the footer
const Nav = (p) => {
  function collapseFooter() {
    if (p.updateIsFooterCollapsed) {
      p.updateIsFooterCollapsed(true);
    }
  }

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
      <Link
        {...p.allMarketsLink}
        onClick={() => {
          p.allMarketsLink.onClick();
          collapseFooter();
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
            collapseFooter();
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
            collapseFooter();
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
            collapseFooter();
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
            collapseFooter();
          }}
          className={classnames('app-nav-link', TRANSACTIONS, { active: p.activeView === TRANSACTIONS }, { working: p.isTransactionsWorking })}
        >
          <i className="nav-icon fa fa-tasks" />
          {!!p.numTransactionsWorking &&
            <span className="nav-count">{p.numTransactionsWorking} </span>
          }
          {p.transactionsTotals.title}
        </Link>
      }
      {p.logged &&
        <Link
          {...p.accountLink}
          onClick={() => {
            p.accountLink.onClick();
            collapseFooter();
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
            collapseFooter();
          }}
          className={classnames('app-nav-link', AUTHENTICATION, { active: p.activeView === AUTHENTICATION })}
        >
          <i className="nav-icon">
            <AugurLogoIcon />
          </i>
          Sign Up / Login
        </Link>
      }
    </nav>
  );
};

export default Nav;
