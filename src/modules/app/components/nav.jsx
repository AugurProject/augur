import React from 'react';

import classnames from 'classnames';

import Link from 'modules/link/components/link';
import AugurLogoFull from 'modules/common/components/augur-logo-full';
import AugurLogoIcon from 'modules/common/components/augur-logo-icon';

import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views';
import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-headers';
import { AUTH_TYPES } from 'modules/auth/constants/auth-types';

// NOTE -- 	first child div is there to pass up a ref so that other methods can
//					acquire the row height of the navs in the footer
const Nav = p => (
	<nav className={`app-nav ${p.className ? p.className : ''}`}>
		<div ref={p.navRef && p.navRef} />
		<button
			className="nav-toggler"
			onClick={p.toggleFooter}
		>
			Toggle
		</button>
		{p.isSideBarAllowed &&
			<button
				className="app-nav-link unstyled"
				onClick={p.toggleSideBar}
			>
				{p.isSideBarCollapsed ? <i></i> : <i></i>}
			</button>
		}
		<Link
			className={classnames('app-nav-link', { active: ((p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader == null) })}
			{...p.marketsLink}
		>
			<i className="nav-icon"></i>
			Markets
		</Link>
		{p.logged && p.hasFavorites &&
			<Link
				className={classnames('app-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === FAVORITES })}
				{...p.favoritesLink}
			>
				<i className="nav-icon"></i>
				{p.marketsInfo.numFavorites &&
					<span className="nav-count">{p.marketsInfo.numFavorites} </span>
				}
				Favorites
			</Link>
		}
		{p.logged && p.hasPendingReports &&
			<Link
				className={classnames('app-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === PENDING_REPORTS })}
				{...p.pendingReportsLink}
			>
				<i className="nav-icon"></i>
				{p.marketsInfo.numPendingReports &&
					<span className="nav-count">{p.marketsInfo.numPendingReports} </span>
				}
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
				className={classnames('app-nav-link', MY_POSITIONS, { active: [MY_POSITIONS, MY_MARKETS, MY_REPORTS].indexOf(p.activeView) > -1 })}
				{...p.myPositionsLink}
			>
				<i className="nav-icon">
					
				</i>
				Portfolio
			</Link>
		}
		{p.logged &&
			<Link
				className={classnames('app-nav-link', TRANSACTIONS, { active: p.activeView === TRANSACTIONS }, { working: p.isTransactionsWorking })}
				{...p.transactionsLink}
			>
				<i className="nav-icon">
					
				</i>
				{p.numTransactionsWorking &&
					<span className="nav-count">{p.numTransactionsWorking} </span>
				}
				{p.transactionsTotals.title}
			</Link>
		}
		{p.logged &&
			<Link
				className={classnames('app-nav-link', ACCOUNT, { active: p.activeView === ACCOUNT })}
				{...p.accountLink}
			>
				<i className="nav-icon">
					
				</i>
				Account
			</Link>
		}
		{!p.logged &&
			<Link className={classnames('app-nav-link', AUTH_TYPES[p.activeView], { active: !!AUTH_TYPES[p.activeView] })} {...p.authLink}>
				<i className="nav-icon">
					<AugurLogoIcon />
				</i>
				Sign Up / Login
			</Link>
		}
	</nav>
);

export default Nav;
