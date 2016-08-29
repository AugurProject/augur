import React, { PropTypes } from 'react';
import SiteHeader from '../../../modules/site/components/site-header';
import SiteFooter from '../../../modules/site/components/site-footer';
import TabNavigation from '../../../modules/common/components/tab-navigation';
import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../../modules/site/constants/pages';
import Positions from '../../../modules/portfolio/components/positions';
import Markets from '../../../modules/portfolio/components/markets';
import Reports from '../../../modules/portfolio/components/reports';

const PortfolioPage = (p) => {
	let node;

	switch (p.siteHeader.activePage) {
	default:
	case MY_POSITIONS:
		node = <Positions {...p.positions} />;
		break;
	case MY_MARKETS:
		node = <Markets {...p.markets} />;
		break;
	case MY_REPORTS:
		node = <Reports {...p.reports} />;
		break;
	}

	return (
		<main className="page portfolio">
			<SiteHeader {...p.siteHeader} />

			<header className="page-header portfolio-header">
				<div className="l-container">
					{!!p.navItems && !!p.navItems.length &&
						<TabNavigation
							activePage={p.siteHeader.activePage}
							navItems={p.navItems}
						/>
					}
				</div>
			</header>

			<div className="page-content">
				<section className="l-container portfolio-content">
					{node}
				</section>
			</div>

			<SiteFooter />
		</main>
	);
};

PortfolioPage.propTypes = {
	siteHeader: PropTypes.object.isRequired,
	navItems: PropTypes.array.isRequired,
	totals: PropTypes.object.isRequired,
	positions: PropTypes.object.isRequired,
	markets: PropTypes.object.isRequired,
	reports: PropTypes.object.isRequired
};

export default PortfolioPage;
