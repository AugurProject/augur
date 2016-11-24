import React from 'react';

import Outcome from 'modules/outcomes/components/outcome';

import { SCALAR } from 'modules/markets/constants/market-types';

const Outcomes = p => (
	<article className="outcomes" >
		<div className="outcomes-header">
			<div className="outcomes-header-full">
				<span>Outcome{!p.marketType === SCALAR && 's'}</span>
				<span>Bid Q.</span>
				<span>Bid</span>
				<span>Ask</span>
				<span>Ask Q</span>
				<span>Last</span>
			</div>
			<div className="outcomes-header-condensed">
				<span>Outcome{!p.marketType === SCALAR && 's'}</span>
				<span>Bid</span>
				<span>Ask</span>
			</div>
		</div>
		<div className="market-content-scrollable" >
			{(p.outcomes || []).map(outcome => (
				<Outcome
					key={outcome.id}
					marketType={p.marketType}
					outcome={outcome}
					selectedOutcome={p.selectedOutcome}
					updateSelectedOutcome={p.updateSelectedOutcome}
					selectedShareDenomination={p.selectedShareDenomination}
					tradeSummary={p.tradeSummary}
					submitTrade={p.submitTrade}
					selectedTradeSide={p.selectedTradeSide}
					updateSelectedTradeSide={p.updateSelectedTradeSide}
					outcomeTradeNavItems={p.outcomeTradeNavItems}
					updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
					minLimitPrice={p.minLimitPrice}
					maxLimitPrice={p.maxLimitPrice}
					updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
				/>
			))}
		</div>
	</article>
);

export default Outcomes;
