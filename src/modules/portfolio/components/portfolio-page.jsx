import React from 'react';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';

const PortfolioPage = (p) => (
	<main className="page positions-page">
		<SiteHeader {...p.siteHeader} />

		<section className="page-content">
			<span>PORTFOLIO!</span>
		</section>

		<SiteFooter />
	</main>
);

PortfolioPage.propTypes = {
	siteHeader: React.PropTypes.object
};

export default PortfolioPage;
