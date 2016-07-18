import React from 'react';
import SiteHeader from '../../../modules/site/components/site-header';
import SiteFooter from '../../../modules/site/components/site-footer';
import SearchSort from '../../../modules/common/components/search-sort';
import PortfolioSummary from '../../../modules/portfolio/components/portfolio-summary';
import Link from '../../../modules/link/components/link';
import Filters from '../../../modules/filters/components/filters';
import TabNavigation from '../../../modules/common/components/tab-navigation';

const PortfolioPage = (p) => (
	<main className="page portfolio-page">
		<SiteHeader {...p.siteHeader} />

		<section className="page-content">
			<SearchSort
				keywords={p.keywords}
				selectedSort={p.selectedSort}
				sortOptions={p.sortOptions}
				onChangeKeywords={p.onChangeKeywords}
				onChangeSort={p.onChangeSort}
			/>

			<div className="l-container">
				<div className="component-header">
					<Link className="button make" {...p.createMarketLink}>
						Make a Market
					</Link>
					<PortfolioSummary summaries={p.portfolio.summaries} />
				</div>
			</div>

			<Filters filters={p.filters} />

			<TabNavigation navItems={p.portfolio.navItems} />

			<div className="l-container">
				<span>PORTFOLIO!</span>
			</div>

		</section>

		<SiteFooter />
	</main>
);

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
