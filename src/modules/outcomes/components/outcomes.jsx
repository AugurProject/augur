import React from 'react';

import OutcomeRow from 'modules/outcomes/components/outcome-row';

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
			<OutcomeRow
				key={outcome.id}
				marketType={p.marketType}
				outcome={outcome}
				selectedOutcome={p.selectedOutcome}
				updateSelectedOutcome={p.updateSelectedOutcome}
			/>
		))}
	</article>
);

export default Outcomes;
