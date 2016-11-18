import React from 'react';

import Outcome from 'modules/outcomes/components/outcome';

import { SCALAR } from 'modules/markets/constants/market-types';

const Outcomes = p => (
	<article className="outcomes" >
		<div className="outcomes-header">
			<span>Outcome{!p.marketType === SCALAR && 's'}</span>
			<span>Bid Q.</span>
			<span>Bid</span>
			<span>Ask</span>
			<span>Ask Q</span>
			<span>Last</span>
		</div>
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
			/>
		))}
	</article>
);

export default Outcomes;
