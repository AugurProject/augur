import React from 'react';

import classnames from 'classnames';

import Link from 'modules/link/components/link';
import AugurLogo from 'modules/common/components/augur-logo';

import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views';
import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-headers';
import { AUTH_TYPES } from 'modules/auth/constants/auth-types';

const Nav = (p) => {
	console.log('p -- ', p);

	return (
		<nav className={`app-nav ${p.className ? p.className : ''}`}>
			<span className="app-nav-link">
				{p.isSideBarAllowed &&
					<button
						className="unstyled"
						onClick={p.toggleSideBar}
					>
						{p.isSideBarCollapsed ? <i></i> : <i></i>}
					</button>
				}
			</span>
			<Link
				className={classnames('app-nav-link', { active: ((p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader == null) })}
				{...p.marketsLink}
			>
				Markets
			</Link>
			{p.logged && !!p.marketsInfo.numFavorites &&
				<Link
					className={classnames('app-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === FAVORITES })}
					{...p.favoritesLink}
				>
					{!!p.marketsInfo.numFavorites && p.marketsInfo.numFavorites} Favorites
				</Link>
			}
			{p.logged && !!p.marketsInfo.numPendingReports &&
				<Link
					className={classnames('app-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === PENDING_REPORTS })}
					{...p.pendingReportsLink}
				>
					{!!p.marketsInfo.numPendingReports && p.marketsInfo.numPendingReports} Pending Reports
				</Link>
			}
			<Link
				className="augur-brand"
				{...p.marketsLink}
			>
				<AugurLogo />
			</Link>
			{p.logged && !!p.portfolioTotals &&
				<Link
					className={classnames('app-nav-link', MY_POSITIONS, { active: [MY_POSITIONS, MY_MARKETS, MY_REPORTS].indexOf(p.activeView) > -1 })}
					{...p.myPositionsLink}
				>
					Portfolio
				</Link>
			}
			{p.logged &&
				<Link
					className={classnames('app-nav-link', TRANSACTIONS, { active: p.activeView === TRANSACTIONS }, { working: p.isTransactionsWorking })}
					{...p.transactionsLink}
				>
					{p.transactionsTotals.title}
				</Link>
			}
			{p.logged &&
				<Link
					className={classnames('app-nav-link', ACCOUNT, { active: p.activeView === ACCOUNT })}
					{...p.accountLink}
				>
					Account
				</Link>
			}
			{!p.logged &&
				<Link className={classnames('app-nav-link', AUTH_TYPES[p.activeView], { active: !!AUTH_TYPES[p.activeView] })} {...p.authLink}>
					Sign Up / Login
				</Link>
			}
		</nav>
	);
};

export default Nav;
