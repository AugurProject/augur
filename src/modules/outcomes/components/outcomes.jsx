import React from 'react';

import OutcomesHeader from 'modules/outcomes/components/outcomes-header';
import OutcomeRow from 'modules/outcomes/components/outcome-row';

const Outcomes = p => (
	<article className="outcomes" >
		<OutcomesHeader />
		{p.outcomes && p.outcomes.map(outcome => (
			<OutcomeRow key={outcome.id} outcome={outcome} />
		))}
	</article>
);

export default Outcomes;
