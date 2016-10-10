import React, { Component } from 'react';
import classnames from 'classnames';

import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../site/constants/views';
import { AUTH_TYPES } from '../../auth/constants/auth-types';
import Link from '../../link/components/link';
import AugurLogo from '../../common/components/augur-logo';
import ValueDenomination from '../../common/components/value-denomination';

export default class SiteHeader extends Component {
	render() {
		const p = this.props;

		return (
			<header
				className="site-header"
				ref={(ref) => { this.siteHeader = ref; }}
			>
				<nav className="site-nav">
					<div className="nav-group left-navs">
						<Link
							className={classnames('site-nav-link', { active: p.activeView === MARKETS })}
							{...p.marketsLink}
						>
							Markets
						</Link>
					</div>
					<div className="nav-group branding">
						<Link
							className="augur-brand"
							{...p.marketsLink}
						>
							<AugurLogo />
						</Link>
					</div>
					<div className="nav-group right-navs">
						{!!p.loginAccount && !!p.loginAccount.id && !!p.portfolioTotals &&
							<Link
								className={classnames('site-nav-link', MY_POSITIONS, { active: [MY_POSITIONS, MY_MARKETS, MY_REPORTS].indexOf(p.activeView) > -1 })}
								{...p.myPositionsLink}
							>
								Portfolio
							</Link>
						}
						{(!!p.loginAccount && !!p.loginAccount.id) &&
							<Link
								className={classnames('site-nav-link', TRANSACTIONS, { active: p.activeView === TRANSACTIONS }, { working: p.isTransactionsWorking })}
								title={p.loginAccount.realEther && `real ether: ${p.loginAccount.realEther.full}`}
								{...p.transactionsLink}
							>
								{p.transactionsTotals.title}
							</Link>
						}
						{p.loginAccount.id &&
							<Link
								className={classnames('site-nav-link', ACCOUNT, { active: p.activeView === ACCOUNT })}
								title={p.loginAccount.realEther && `${p.loginAccount.realEther.full} real ETH`}
								{...p.accountLink}
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
					</div>
				</nav>
			</header>
		);
	}
}


// TODO -- Prop Validations
// SiteHeader.propTypes = {
// 	activeView: PropTypes.string,
// 	loginAccount: PropTypes.object,
// 	transactionsTotals: PropTypes.object,
// 	isTransactionsWorking: PropTypes.bool,
// 	marketsLink: PropTypes.object,
// 	myPositionsLink: PropTypes.object,
// 	transactionsLink: PropTypes.object,
// 	authLink: PropTypes.object,
// 	portfolioTotals: PropTypes.object
// };
