import React from 'react';

import OutcomeRow from 'modules/outcomes/components/outcome-row';

const Outcomes = p => (
	<article className="outcomes" >
		<div className="outcomes-header">
			<span>Outcomes</span>
			<span>Bid Q.</span>
			<span>Bid</span>
			<span>Ask</span>
			<span>Ask Q</span>
			<span>Last</span>
		</div>
		{(p.outcomes || []).map(outcome => (
			<OutcomeRow
				key={outcome.id}
				outcome={outcome}
				selectedOutcome={p.selectedOutcome}
				updateSelectedOutcome={p.updateSelectedOutcome}
			/>
		))}
	</article>
);

export default Outcomes;
