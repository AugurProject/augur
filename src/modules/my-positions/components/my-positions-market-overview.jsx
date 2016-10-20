import React from 'react';
import ValueDenomination from 'modules/common/components/value-denomination';

const PositionsMarketOverview = p => (
	<section className="positions-market-overview">
		<div className="position">
			<span className="description">{p.description}</span>
			<div className="position-group">
				<div className="position-pair realized-net">
					<span className="title">total realized P/L</span>
					<ValueDenomination {...p.realizedNet} />
				</div>
				<div className="position-pair unrealized-net">
					<span className="title">total unrealized P/L</span>
					<ValueDenomination {...p.unrealizedNet} />
				</div>
				<div className="position-pair total-net">
					<span className="title">total P/L</span>
					<ValueDenomination {...p.totalNet} />
				</div>
			</div>
		</div>
	</section>
);

PositionsMarketOverview.propTypes = {
	description: React.PropTypes.string.isRequired,
	unrealizedNet: React.PropTypes.object.isRequired,
	realizedNet: React.PropTypes.object.isRequired
};

export default PositionsMarketOverview;
