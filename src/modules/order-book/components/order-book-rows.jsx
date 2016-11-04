import React from 'react';

import OrderBookRowSide from 'modules/order-book/components/order-book-row-side';

const OrderBookRows = p => (
	<article className="order-book-rows">
		<OrderBookRowSide
			orders={p.bids}
			selectedShareDenomination={p.selectedShareDenomination}
		/>
		<OrderBookRowSide
			orders={p.asks}
			selectedShareDenomination={p.selectedShareDenomination}
		/>
	</article>
);

export default OrderBookRows;
