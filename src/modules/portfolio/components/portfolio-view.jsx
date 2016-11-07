import React, { PropTypes } from 'react';

import TabNavigation from 'modules/common/components/tab-navigation';
import Positions from 'modules/portfolio/components/positions';
import Markets from 'modules/portfolio/components/markets';
import Reports from 'modules/portfolio/components/reports';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views';

const PortfolioView = (p) => {
	let node;

	switch (p.activeView) {
		default:
		case MY_POSITIONS:
			node = <Positions {...p.positions} settings={p.settings} />;
			break;
		case MY_MARKETS:
			node = <Markets {...p.markets} />;
			break;
		case MY_REPORTS:
			node = <Reports {...p.reports} />;
			break;
	}
	return (
		<section id="portfolio_view" >
			<header className="page-header portfolio-header">
				{!!p.navItems && !!p.navItems.length &&
					<TabNavigation
						activeView={p.activeView}
						navItems={p.navItems}
					/>
				}
			</header>

			<div className="page-content">
				<section className="portfolio-content">
					{node}
				</section>
			</div>
		</section>
	);
};

PortfolioView.propTypes = {
	navItems: PropTypes.array.isRequired,
	totals: PropTypes.object.isRequired,
	positions: PropTypes.object.isRequired,
	markets: PropTypes.object.isRequired,
	reports: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired
};

export default PortfolioView;
