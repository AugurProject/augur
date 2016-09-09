import React from 'react';
import classnames from 'classnames';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';

const BalancesPage = (p) => (
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

BalancesPage.propTypes = {
	className: React.PropTypes.string
};

export default BalancesPage;
