import React from 'react';
import Positions from '../../../modules/portfolio/components/positions';
import PositionsSummary from '../../../modules/portfolio/components/positions-summary';

const PortfolioPositions = (p) => (
	<div className="positions-page">
		<header className="page-header positions-header">
			<div className="l-container">
				<PositionsSummary {...p.positionsSummary} />
			</div>
		</header>

		<section className="page-content">
			<div className="l-container">
				{!!p.positionsMarkets && !!p.positionsMarkets.length && p.positionsMarkets.map(positionsMarket => (
					<div key={positionsMarket.id} className="positions-container">
						<span className="description">{positionsMarket.description}</span>
						{!!positionsMarket.outcomes && !!positionsMarket.outcomes.length &&
							<Positions
								className="page-content positions-content"
								outcomes={positionsMarket.outcomes}
							/>
						}
					</div>
				))}
			</div>
		</section>
	</div>
);

export default PortfolioPositions;
