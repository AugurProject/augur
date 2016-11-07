import React from 'react';

import MarketPositionsRow from 'modules/market/components/market-positions-row';
import NullStateMessage from 'modules/common/components/null-state-message';

import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

const MarketPositions = (p) => {
	const outcomePositions = getValue(p, 'market.myPositionOutcomes');
	const nullMessage = 'No Current Positions';

	return (
		<article className="market-positions">
			{!outcomePositions ?
				<NullStateMessage message={nullMessage} /> :
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
