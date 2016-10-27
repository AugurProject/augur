import React from 'react';

import OutcomeOrderBookHeader from 'modules/outcomes/components/outcome-order-book-header';
import OutcomeOrderBookRows from 'modules/outcomes/components/outcome-order-book-rows';

// NOTE --
// Bids + Asks are rendered into individual row components -- flexbox is utilized for side-by-side layout
const OutcomeOrderBook = p => (
	<article className="outcome-order-book">
		<h3>Order Book - {p.outcome.name}</h3>
		<OutcomeOrderBookHeader />
		<OutcomeOrderBookRows
			bids={p.outcome.orderBook.bids}
			asks={p.outcome.orderBook.asks}
		/>
	</article>
);

export default OutcomeOrderBook;
