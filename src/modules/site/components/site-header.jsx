import React from 'react';
import classnames from 'classnames';
import { ACCOUNT, MARKETS, TRANSACTIONS, BALANCES, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../site/constants/pages';
import { AUTH_TYPES } from '../../auth/constants/auth-types';
import Link from '../../link/components/link';
import ValueDenomination from '../../common/components/value-denomination';

const SiteHeader = (p) => (
	<header className="site-header">
		<nav className="site-nav">
			<Link className="site-nav-link augur-brand" {...p.marketsLink}>augur</Link>

			<span className="spacer">&nbsp;</span>

			<Link className={classnames('site-nav-link', { active: p.activePage === MARKETS })} {...p.marketsLink}>Markets</Link>

			{!!p.loginAccount && !!p.loginAccount.id && !!p.portfolioTotals &&
				<Link className={classnames('site-nav-link', MY_POSITIONS, { active: [MY_POSITIONS, MY_MARKETS, MY_REPORTS].indexOf(p.activePage) > -1 })} {...p.myPositionsLink}>
					Portfolio
				</Link>
			}

			{(!!p.loginAccount && !!p.loginAccount.id) &&
				<Link
					className={classnames('site-nav-link', TRANSACTIONS, { active: p.activePage === TRANSACTIONS }, { working: p.isTransactionsWorking })}
					title={p.loginAccount.realEther && `real ether: ${p.loginAccount.realEther.full}`}
					{...p.transactionsLink}
				>
					{p.transactionsTotals.title}
				</Link>
			}

			{(!!p.loginAccount && !!p.loginAccount.id) &&
				<Link
					className={classnames('site-nav-link', BALANCES, { active: p.activePage === BALANCES })}
					{...p.balancesLink}
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

			{!p.loginAccount.id &&
				<Link className={classnames('site-nav-link', AUTH_TYPES[p.activePage], { active: !!AUTH_TYPES[p.activePage] })} {...p.authLink}>
					Sign Up / Login
				</Link>
			}
			{p.loginAccount.id &&
				<Link className={classnames('site-nav-link', ACCOUNT, { active: p.activePage === ACCOUNT })} {...p.accountLink}>
					{p.accountLinkText}
				</Link>
			}
		</nav>
	</header>
);

SiteHeader.propTypes = {
	activePage: React.PropTypes.string,
	loginAccount: React.PropTypes.object,
	transactionsTotals: React.PropTypes.object,
	isTransactionsWorking: React.PropTypes.bool,
	marketsLink: React.PropTypes.object,
	myPositionsLink: React.PropTypes.object,
	transactionsLink: React.PropTypes.object,
	balancesLink: React.PropTypes.object,
	authLink: React.PropTypes.object,
	portfolioTotals: React.PropTypes.object
};

export default SiteHeader;
