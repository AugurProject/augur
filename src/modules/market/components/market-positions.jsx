import React from 'react';

import MarketPositionsRow from 'modules/market/components/market-positions-row';

import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

const MarketPositions = (p) => {
	const outcomePositions = getValue(p, 'market.myPositionOutcomes');

	return (
		<article className="market-positions">
			{!outcomePositions ?
				<span className="null-state-message">No Market Positions</span> :
				<div>
					<div className="market-positions-header">
						<span>{!p.marketType === SCALAR ? 'Outcomes' : 'Outcome'}</span>
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
							marketType={p.marketType}
							outcome={outcome}
							selectedShareDenomination={p.selectedShareDenomination}
						/>
					)}
				</div>
			}
		</article>
	);
};

export default MarketPositions;
