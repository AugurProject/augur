import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';

const OutcomeRow = p => (
	<article className="outcome-row">
		<span className="outcome">{p.outcome.name || ''}</span>
		<ValueDenomination formatted={p.outcome.topBid.shares.formatted} />
		<ValueDenomination formatted={p.outcome.topBid.price.formatted} />
		<ValueDenomination formatted={p.outcome.topAsk.price.formatted} />
		<ValueDenomination formatted={p.outcome.topAsk.shares.formatted} />
		<ValueDenomination formatted={p.outcome.lastPrice.formatted} />
	</article>
);

export default OutcomeRow;
