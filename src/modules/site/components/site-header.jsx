import React from 'react';
import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../site/constants/pages';
import { AUTH_TYPES } from '../../auth/constants/auth-types';
import Link from '../../link/components/link';
import ValueDenomination from '../../common/components/value-denomination';
import classnames from 'classnames';
import AugurLogo from '../../common/components/augur-logo';

const SiteHeader = (p) => {
	return (
		<header className="site-header">
			<nav className="site-nav">
				<div className="nav-group left-navs">
					<Link className={p.activePage === MARKETS && 'active'} {...p.marketsLink}>Markets</Link>
				</div>
				<div className="nav-group branding">
					<Link className="augur-brand" {...p.marketsLink}>
						<AugurLogo />
					</Link>
				</div>
				<div className="nav-group right-navs">
					{!!p.loginAccount && !!p.loginAccount.id && !!p.portfolioTotals &&
					<Link className={classnames('site-nav-link', MY_POSITIONS, { active: [MY_POSITIONS, MY_MARKETS, MY_REPORTS].indexOf(p.activePage) > -1 })} {...p.myPositionsLink}>
						Positions: 4 (+12.7%)
					</Link>
					}
					{(!!p.loginAccount && !!p.loginAccount.id) &&
					<Link
						className={classnames('site-nav-link', TRANSACTIONS, { active: p.activePage === TRANSACTIONS }, { working: p.isTransactionsWorking })}
						{...p.transactionsLink}
					>
						{p.transactionsTotals.title}
					</Link>
					}
					{!p.loginAccount.id &&
					<Link className={classnames('site-nav-link', AUTH_TYPES[p.activePage], { active: !!AUTH_TYPES[p.activePage] })} {...p.authLink}>
						Sign Up / Login
					</Link>
				}
				{p.loginAccount.id &&
					<Link
						className={classnames('site-nav-link', ACCOUNT, { active: p.activePage === ACCOUNT })} {...p.accountLink}
						title={p.loginAccount.realEther && `${p.loginAccount.realEther.full} real ETH`}
					>
						<ValueDenomination
							{...p.loginAccount.rep || {}}
							formatted={p.loginAccount.rep && p.loginAccount.rep.rounded}
							formattedValue={p.loginAccount.rep && p.loginAccount.rep.roundedValue}
						/>
						<ValueDenomination
							{...p.loginAccount.ether || {}}
							formatted={p.loginAccount.ether && p.loginAccount.ether.rounded}
							formattedValue={p.loginAccount.ether && p.loginAccount.ether.roundedValue}
						/>
					</Link>
				}
				</div>
			</nav>
		</header>
	);
};

SiteHeader.propTypes = {
	activePage: React.PropTypes.string,
	loginAccount: React.PropTypes.object,
	transactionsTotals: React.PropTypes.object,
	isTransactionsWorking: React.PropTypes.bool,
	marketsLink: React.PropTypes.object,
	myPositionsLink: React.PropTypes.object,
	transactionsLink: React.PropTypes.object,
	authLink: React.PropTypes.object,
	portfolioTotals: React.PropTypes.object
};

export default SiteHeader;
