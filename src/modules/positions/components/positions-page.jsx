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
				{!!p.markets && !!p.markets.length && p.markets.map(market => (
					<div key={market.id} className="positions-container">
						<span className="description">{market.description}</span>
						{!!market.positionOutcomes && !!market.positionOutcomes.length &&
							<Positions
								className="page-content positions-content"
								outcomes={market.positionOutcomes}
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
	markets: React.PropTypes.array
};

export default PositionsPage;
