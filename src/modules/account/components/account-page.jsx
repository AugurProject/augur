import React, { PropTypes, Component } from 'react';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
// import Link from '../../link/components/link';
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
						<h1>AccountID: {p.account.id}</h1>
						<h2>Account Handle: {p.account.handle}</h2>
					</div>
				</header>

				<section className="page-content">
					<div className="l-container">
						<div className="account-resources">
							<h1>Account Resources</h1>

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
					</div>
				</section>
				<SiteFooter />
			</main>
		);
	}
}
