import React from 'react';

import OrderBookHeader from 'modules/order-book/components/order-book-header';
import OrderBookRows from 'modules/order-book/components/order-book-rows';

// NOTE --
// Bids + Asks are rendered into individual row components -- flexbox is utilized for side-by-side layout
const OrderBook = p => (
	<article className="outcome-order-book">
		<h3>Order Book - {p.outcome.name}</h3>
		<OrderBookHeader />
		<OrderBookRows
			bids={p.outcome.orderBook.bids}
			asks={p.outcome.orderBook.asks}
		/>
	</article>
);

export default OrderBook;
