import React, { Component } from 'react';
import classnames from 'classnames';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';

export default class BalancesPage extends Component {
	static propTypes = {
		className: React.PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {
		const p = this.props;

		return (
			<main className={classnames('page account')}>
				<SiteHeader {...p.siteHeader} />
				<header className="page-header">
					<span className="big-line">Balances</span>
				</header>

				<section className="page-content">
					<div className="l-container">
						<div className="balances-section">
						</div>
					</div>
				</section>
				<SiteFooter />
			</main>
		);
	}
}
