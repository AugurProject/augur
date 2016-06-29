import React from 'react';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Positions from '../../positions/components/positions';
import PositionsSummary from '../../positions/components/positions-summary';

const PositionsPage = (p) => (
	<main className="page positions-page">
		<SiteHeader {...p.siteHeader} />

		<header className="page-header">
			<div className="l-container">
				<PositionsSummary {...p.positionsSummary} />
			</div>
		</header>

		<section className="page-content">
			<div className="l-container">
				{!!p.positionsMarkets && !!p.positionsMarkets.length && p.positionsMarkets.map(positionsMarket => (
					<div key={positionsMarket.id} className="positions-container">
						<span className="description">{positionsMarket.description}</span>
						{!!positionsMarket.positionOutcomes && !!positionsMarket.positionOutcomes.length &&
							<Positions
								className="page-content positions-content"
								outcomes={positionsMarket.positionOutcomes}
							/>
						}
					</div>
				))}
			</div>
		</section>

		<SiteFooter />
	</main>
);

PositionsPage.propTypes = {
	className: React.PropTypes.string,
	siteHeader: React.PropTypes.object,
	positionsSummary: React.PropTypes.object,
	positionsMarkets: React.PropTypes.array
};

export default PositionsPage;
