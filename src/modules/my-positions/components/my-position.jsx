import React from 'react';
import ValueDenomination from '../../common/components/value-denomination';

const Position = (p) => (
	<div className="position">
		<div className="position-group main-group">
			<span className="position-name">{p.name}</span>
			<ValueDenomination {...p.qtyShares} />
		</div>
		<div className="position-group">
			<div className="position-pair purchase-price">
				<span className="title">avg. trade price</span>
				<ValueDenomination {...p.purchasePrice} />
			</div>
			<div className="position-pair last-price">
				<span className="title">last trade price</span>
				<ValueDenomination {...p.lastPrice} />
			</div>
		</div>
		<div className="position-group">
			<div className="position-pair realized-net">
				<span className="title">realized P/L</span>
				<ValueDenomination {...p.realizedNet} />
			</div>
			<div className="position-pair unrealized-net">
				<span className="title">unrealized P/L</span>
				<ValueDenomination {...p.unrealizedNet} />
			</div>
			<div className="position-pair total-net">
				<span className="title">total P/L</span>
				<ValueDenomination {...p.totalNet} />
			</div>
		</div>
	</div>
);

Position.propTypes = {
	name: React.PropTypes.string,
	qtyShares: React.PropTypes.object,
	totalValue: React.PropTypes.object,
	gainPercent: React.PropTypes.object,
	lastPrice: React.PropTypes.object,
	purchasePrice: React.PropTypes.object,
	shareChange: React.PropTypes.object,
	totalCost: React.PropTypes.object,
	realizedNet: React.PropTypes.object,
	unrealizedNet: React.PropTypes.object,
	totalNet: React.PropTypes.object
};

export default Position;
