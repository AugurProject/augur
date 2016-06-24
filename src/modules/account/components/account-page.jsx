import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Link from '../../link/components/link';
import { AUTH_TYPES } from '../../auth/constants/auth-types';
import ValueDenomination from '../../common/components/value-denomination';

export default class AccountPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const p = this.props;
		console.log(p);

		return (
			<main className="page account">
				<SiteHeader {...p.siteHeader} />

				<header className="page-header">
					<div className="l-container">
						<h1>Account ID: {p.account.id}</h1>
						<h2>Account Handle: {p.account.handle}</h2>
					</div>
				</header>

				<section className="page-content">
					<div className="l-container">
						<div className="account-details">
							<h1>Account Resources</h1>
							<div className="account-resources">
								<ValueDenomination
									{...p.account.rep || {}}
									formatted={p.account.rep && p.account.rep.formatted}
									formattedValue={p.account.rep && p.account.rep.formattedValue}
								/>
								<ValueDenomination
									{...p.account.ether || {}}
									formatted={p.account.ether && p.account.ether.formatted}
									formattedValue={p.account.ether && p.account.ether.formattedValue}
								/>
							</div>
							<div className="remember">
								<p>
									Remember:
								</p>
								<p>
									Augur is a completely decentralized system including user accounts. Your credentials never leave the browser, and you are responsible for keeping them safe.
								</p>
								<p>
									It is impossible to recover your account if your credentials get lost!
								</p>
							</div>
							<div className="account-actions">
								<Link className="button sign-out" {...p.siteHeader.authLink}>
									Sign Out
								</Link>
							</div>
						</div>
					</div>
				</section>
				<SiteFooter />
			</main>
		);
	}
}
