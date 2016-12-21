import React from 'react';

import classnames from 'classnames';

import Link from 'modules/link/components/link';
import AugurLogoFull from 'modules/common/components/augur-logo-full';
import AugurLogoIcon from 'modules/common/components/augur-logo-icon';
import SideBarFilterIcon from 'modules/common/components/side-bar-filter-icon';

import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views';
import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-headers';
import { AUTH_TYPES } from 'modules/auth/constants/auth-types';

// NOTE -- 	first child div is there to pass up a ref so that other methods can
//					acquire the row height of the navs in the footer
const Nav = p => (
	<nav className={`app-nav ${p.className ? p.className : ''}`}>
		<div ref={p.navRef && p.navRef} />
		{p.isSideBarAllowed &&
			<button
				className="app-nav-link unstyled"
				onClick={p.toggleSideBar}
			>
				{p.isSideBarCollapsed ? <SideBarFilterIcon /> : <i></i>}
			</button>
		}
		<Link
			{...p.marketsLink}
			className={classnames('app-nav-link', { active: ((p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader == null) })}
		>
			<i className="nav-icon"></i>
			Markets
		</Link>
		{p.logged && !!p.numFavorites &&
			<Link
				{...p.favoritesLink}
				className={classnames('app-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === FAVORITES })}
			>
				<i className="nav-icon"></i>
				<span className="nav-count">{p.numFavorites} </span>
				Favorites
			</Link>
		}
		{p.logged && !!p.numPendingReports &&
			<Link
				{...p.pendingReportsLink}
				className={classnames('app-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === PENDING_REPORTS })}
			>
				<i className="nav-icon"></i>
				<span className="nav-count">{p.numPendingReports} </span>
				Pending Reports
			</Link>
		}
		<Link
			className="augur-brand"
			{...p.marketsLink}
		>
			<AugurLogoFull />
		</Link>
		{p.logged && !!p.portfolioTotals &&
			<Link
				{...p.myPositionsLink}
				className={classnames('app-nav-link', MY_POSITIONS, { active: [MY_POSITIONS, MY_MARKETS, MY_REPORTS].indexOf(p.activeView) > -1 })}
			>
				<i className="nav-icon">
					
				</i>
				Portfolio
			</Link>
		}
		{p.logged &&
			<Link
				{...p.transactionsLink}
				className={classnames('app-nav-link', TRANSACTIONS, { active: p.activeView === TRANSACTIONS }, { working: p.isTransactionsWorking })}
			>
				<i className="nav-icon">
					
				</i>
				{!!p.numTransactionsWorking &&
					<span className="nav-count">{p.numTransactionsWorking} </span>
				}
				{p.transactionsTotals.title}
			</Link>
		}
		{p.logged &&
			<Link
				{...p.accountLink}
				className={classnames('app-nav-link', ACCOUNT, { active: p.activeView === ACCOUNT })}
			>
				<i className="nav-icon">
					
				</i>
				Account
			</Link>
		}
		{!p.logged &&
			<Link
				{...p.authLink}
				className={classnames('app-nav-link', AUTH_TYPES[p.activeView], { active: !!AUTH_TYPES[p.activeView] })}
			>
				<i className="nav-icon">
					<AugurLogoIcon />
				</i>
				Sign Up / Login
			</Link>
		}
	</nav>
);

export default Nav;
