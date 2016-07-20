import React from 'react';
import SiteHeader from '../../../modules/site/components/site-header';
import SiteFooter from '../../../modules/site/components/site-footer';
import SearchSort from '../../../modules/common/components/search-sort';
import PortfolioSummary from '../../../modules/portfolio/components/summary';
import Positions from '../../../modules/positions/components/portfolio';
import Markets from '../../../modules/markets/components/portfolio';
import Reports from '../../../modules/reports/components/portfolio';
import Link from '../../../modules/link/components/link';
import Filters from '../../../modules/filters/components/filters';
import TabNavigation from '../../../modules/common/components/tab-navigation';
import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../../modules/site/constants/pages';

const PortfolioPage = (p) => {
	let node;

	switch (p.siteHeader.activePage) {
	default:
	case MY_POSITIONS:
		node = <Positions />;
		break;
	case MY_MARKETS:
		node = <Markets />;
		break;
	case MY_REPORTS:
		node = <Reports />;
		break;
	}

	return (
		<main className="page portfolio">
			<SiteHeader {...p.siteHeader} />

			<div className="page-content">
				<section className="page-content portfolio-content">
					<div className="component-header">
						<Link className="button make" {...p.createMarketLink} >
							Make a Market
						</Link>
						<PortfolioSummary summaries={p.portfolio.summaries} />
					</div>

					<Filters filters={p.filters} />

					<div className="portfolio-item">
						<TabNavigation
							activePage={p.siteHeader.activePage}
							navItems={p.portfolio.navItems}
						/>

						<SearchSort
							keywords={p.keywords}
							selectedSort={p.selectedSort}
							sortOptions={p.sortOptions}
							onChangeKeywords={p.onChangeKeywords}
							onChangeSort={p.onChangeSort}
						/>

						{node}
					</div>
				</section>

			</div>

			<SiteFooter />
		</main>
	);
};

PortfolioPage.propTypes = {
	portfolio: React.PropTypes.object,
	siteHeader: React.PropTypes.object,
	keywords: React.PropTypes.string,
	selectedSort: React.PropTypes.object,
	sortOptions: React.PropTypes.array,
	onChangeKeywords: React.PropTypes.func,
	onChangeSort: React.PropTypes.func,
	filters: React.PropTypes.array
};

export default PortfolioPage;
