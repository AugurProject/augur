import React from 'react';

import OrderBookRowSide from 'modules/order-book/components/order-book-row-side';

import { BID } from 'modules/transactions/constants/types';

const OrderBookRows = p => (
	<article className="order-book-rows">
		<OrderBookRowSide
			id={p.id}
			type={BID}
			orders={p.bids}
			selectedShareDenomination={p.selectedShareDenomination}
			selectedTradeSide={p.selectedTradeSide}
		/>
		<OrderBookRowSide
			id={p.id}
			orders={p.asks}
			selectedShareDenomination={p.selectedShareDenomination}
			selectedTradeSide={p.selectedTradeSide}
		/>
	</article>
);

export default OrderBookRows;
