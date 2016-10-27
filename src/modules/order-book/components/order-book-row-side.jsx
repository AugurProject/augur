import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';

const OrderBookRowSide = p => (
	<article className="order-book-row-side">
		{(p.orders || []).map((order, i) => (
			<div
				key={i}
				className="order-book-side-row"
			>
				<ValueDenomination formatted={order.shares.formatted} />
				<ValueDenomination formatted={order.price.formatted} />
			</div>
		))}
	</article>
);

export default OrderBookRowSide;
