import React from 'react';

import OutcomeOrderBookSideRow from 'modules/outcomes/components/outcome-order-book-side-row';

const OutcomeOrderBookRows = p => (
	<article className="outcome-order-book-rows">
		<OutcomeOrderBookSideRow orders={p.bids} />
		<OutcomeOrderBookSideRow orders={p.asks} />
	</article>
);

export default OutcomeOrderBookRows;
