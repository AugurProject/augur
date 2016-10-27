import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';

const OrderBookSideRow = p => (
	<article className="order-book-side-row">
		{(p.orders || []).map((order, i) => (
			<div
				key={i}
				className="order-book-side-row-cells"
			>
				<ValueDenomination formatted={order.shares.formatted} />
				<ValueDenomination formatted={order.price.formatted} />
			</div>
		))}
	</article>
);

export default OrderBookSideRow;
