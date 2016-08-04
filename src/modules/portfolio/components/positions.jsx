import React from 'react';
import Positions from '../../../modules/my-positions/components/positions';

const PortfolioPositions = (p) => (
	<div className="positions-content">
		{!!p.positions && !!p.positions.markets && !!p.positions.markets.length && p.positions.markets.map(market => (
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
);

PortfolioPositions.propTypes = {
	positions: React.PropTypes.object.isRequired
};

export default PortfolioPositions;
