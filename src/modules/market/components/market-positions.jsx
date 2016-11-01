import React from 'react';

import MarketPositionsRow from 'modules/market/components/market-positions-row';

import getValue from 'utils/get-value';

const MarketPositions = (p) => {
	const outcomePositions = getValue(p, 'market.myPositionOutcomes');
	const marketType = getValue(p, 'market.type');

	return (
		<article className="market-positions">
			<div className="market-positions-header">
				<span>Outcomes</span>
				<span>Shares</span>
				<span>Avg Price</span>
				<span>Last Price</span>
				<span>Realized P/L</span>
				<span>Unrealized P/L</span>
				<span>Total P/L</span>
			</div>
			{(outcomePositions || []).map(outcome =>
				<MarketPositionsRow
					key={outcome.id}
					type={marketType}
					outcome={outcome}
				/>
			)}
		</article>
	);
};

export default MarketPositions;
