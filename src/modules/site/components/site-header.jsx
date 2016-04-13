import React from 'react';
import classnames from 'classnames';

import { MARKETS, POSITIONS, TRANSACTIONS } from '../../site/constants/pages';
import { AUTH_TYPES } from '../../auth/constants/auth-types';

import Link from '../../link/components/link';
import ValueDenomination from '../../common/components/value-denomination';

module.exports = React.createClass({
	propTypes: {
		activePage: React.PropTypes.string,
		loginAccount: React.PropTypes.object,
		positionsSummary: React.PropTypes.object,
		transactionsTotals: React.PropTypes.object,
		isTransactionsWorking: React.PropTypes.bool,

		marketsLink: React.PropTypes.object,
		positionsLink: React.PropTypes.object,
		transactionsLink: React.PropTypes.object,
		authLink: React.PropTypes.object
	},

	render: function() {
		var p = this.props;

		return (
			<header className="site-header">
				<nav className="site-nav">
					<Link className={ classnames('site-nav-link', 'augur', { 'active': p.activePage === MARKETS }) } { ...p.marketsLink }>augur</Link>

					<span className="spacer">&nbsp;</span>

					{ !!p.loginAccount && !!p.loginAccount.id &&
						<Link className={ classnames('site-nav-link', POSITIONS, { 'active': p.activePage === POSITIONS }) } { ...p.positionsLink }>

							{ !!p.positionsSummary && !!p.positionsSummary.numPositions &&
								<ValueDenomination className="positions-num" { ...p.positionsSummary.numPositions } isRounded={ true } /> + ' &nbsp;'
							}
							<strong className="positions-name">Positions</strong> &nbsp;

							 { !!p.positionsSummary && !!p.positionsSummary.gainPercent &&
								<ValueDenomination className="positions-gain" { ...p.positionsSummary.gainPercent } isRounded={ true } />
							 }
						</Link>
					}
					{ !!p.loginAccount && !!p.loginAccount.id &&
						<Link className={ classnames('site-nav-link', TRANSACTIONS, { 'active': p.activePage === TRANSACTIONS }, { 'working': p.isTransactionsWorking }) }
							title={ p.loginAccount.realEther && 'real ether: ' + p.loginAccount.realEther.full }
							{ ...p.transactionsLink }>

								{ (!p.isTransactionsWorking || p.activePage === TRANSACTIONS) &&
									<span className="link-text">
										<ValueDenomination { ...p.loginAccount.rep || {} } isMinimized={ true } isRounded={ true } />
										&nbsp;&nbsp;&nbsp;
										<ValueDenomination { ...p.loginAccount.ether || {} } isMinimized={ true } isRounded={ true } />
									</span>
								}
								{ p.isTransactionsWorking && p.activePage !== TRANSACTIONS &&
									<span className="link-text">
										{ p.transactionsTotals.title }
									</span>
								}
						</Link>
					}

					<Link className={ classnames('site-nav-link', AUTH_TYPES[p.activePage], { 'active': !!AUTH_TYPES[p.activePage] }) } { ...p.authLink }>
						{ p.loginAccount && p.loginAccount.id ? p.loginAccount.handle : 'Sign Up / Login' }
					</Link>
				</nav>
			</header>
		);
	}
});