import React from 'react';

import OrderBookRowSide from 'modules/order-book/components/order-book-row-side';

import { BID } from 'modules/transactions/constants/types';

const OrderBookRows = p => (
	<article className="order-book-rows">
		<OrderBookRowSide
			type={BID}
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
