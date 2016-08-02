import React from 'react';
import SiteHeader from '../../../modules/site/components/site-header';
import SiteFooter from '../../../modules/site/components/site-footer';
import MyPositions from '../../../modules/portfolio/components/my-positions';
import MyMarkets from '../../../modules/portfolio/components/my-markets';
import MyReports from '../../../modules/portfolio/components/my-reports';
import TabNavigation from '../../../modules/common/components/tab-navigation';
import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../../modules/site/constants/pages';

const PortfolioPage = (p) => {
	let node;

	switch (p.siteHeader.activePage) {
	default:
	case MY_POSITIONS:
		node = (
			<MyPositions
				siteHeader={p.siteHeader}
				positionsSummary={p.positionsSummary}
				positionsMarkets={p.positionsMarkets}
			/>
		);
		break;
	case MY_MARKETS:
		node = <MyMarkets markets={p.portfolio.loginAccountMarkets} />;
		break;
	case MY_REPORTS:
		node = <MyReports />;
		break;
	}

	return (
		<main className="page portfolio">
			<SiteHeader {...p.siteHeader} />
			<div className="page-content">
				<section className="page-content portfolio-content">
					<div className="component-header">
						{!!p.portfolio && !!p.portfolio.navItems.length &&
							<TabNavigation
								activePage={p.siteHeader.activePage}
								navItems={p.portfolio.navItems}
							/>
						}
					</div>

					<div className="portfolio-item">
						{node}
					</div>
				</section>
			</div>
			<SiteFooter />
		</main>
	);
};

PortfolioPage.propTypes = {
	portfolio: React.PropTypes.object.isRequired,
	siteHeader: React.PropTypes.object.isRequired,
	positionsSummary: React.PropTypes.object.isRequired,
	positionsMarkets: React.PropTypes.array.isRequired
};

export default PortfolioPage;
