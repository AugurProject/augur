import React from 'react';

import OrderBookSideRow from 'modules/order-book/components/order-book-side-row';

const OrderBookRows = p => (
	<article className="outcome-order-book-rows">
		<OrderBookSideRow orders={p.bids} />
		<OrderBookSideRow orders={p.asks} />
	</article>
);

export default OrderBookRows;
