import React from 'react';
import ValueDenomination from '../../common/components/value-denomination';
import { SCALAR } from '../../markets/constants/market-types';

const Position = (p) => (
	<div className="position">
		<div className="position-group main-group">
			{p.type === SCALAR ?
				<span className="position-name">{p.lastPricePercent.rounded}</span> :
				<span className="position-name">{p.name}</span>
			}
			<ValueDenomination {...p.qtyShares} />
			<ValueDenomination
				{...p.gainPercent}
				formatted={p.gainPercent.minimized}
				denomination={`${p.gainPercent.denomination} return`}
			/>
		</div>
		<div className="position-group">
			<div className="position-pair purchase-price">
				<span className="title">avg. purchase price</span>
				<ValueDenomination {...p.purchasePrice} />
			</div>
			<div className="position-pair last-price">
				<span className="title">last trade price</span>
				<ValueDenomination {...p.lastPrice} />
			</div>
			<div className="position-pair per-share-gain">
				<span className="title">per share gain/loss</span>
				<ValueDenomination {...p.shareChange} />
			</div>
		</div>
		<div className="position-group">
			<div className="position-pair total-cost">
				<span className="title">total cost</span>
				<ValueDenomination {...p.totalCost} />
			</div>
			<div className="position-pair total-value">
				<span className="title">total value</span>
				<ValueDenomination {...p.totalValue} />
			</div>
			<div className="position-pair net-change">
				<span className="title">net gain/loss</span>
				<ValueDenomination {...p.netChange} />
			</div>
		</div>
	</div>
);

Position.propTypes = {
	name: React.PropTypes.string,
	type: React.PropTypes.string,
	qtyShares: React.PropTypes.object,
	totalValue: React.PropTypes.object,
	gainPercent: React.PropTypes.object,
	lastPrice: React.PropTypes.object,
	lastPricePercent: React.PropTypes.object,
	purchasePrice: React.PropTypes.object,
	shareChange: React.PropTypes.object,
	totalCost: React.PropTypes.object,
	netChange: React.PropTypes.object
};

export default Position;
