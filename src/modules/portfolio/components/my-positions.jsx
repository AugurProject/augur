import React from 'react';
import Positions from '../../../modules/positions/components/positions';

const MyPositions = (p) => (
	<div className="positions-page">
		<section className="page-content">
			<div className="l-container">
				{!!p.positions && !!p.positions.markets && !!p.positions.markets.length && p.positions.markets.map(market => (
					<div key={market.id} className="positions-container">
						<span className="description">{market.description}</span>
						{!!market.outcomes && !!market.outcomes.length &&
							<Positions
								className="page-content positions-content"
								outcomes={market.outcomes}
							/>
						}
					</div>
				))}
			</div>
		</section>
	</div>
);

MyPositions.propTypes = {
	positions: React.PropTypes.object.isRequired
};

export default MyPositions;
