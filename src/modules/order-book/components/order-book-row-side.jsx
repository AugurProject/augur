import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

const OrderBookRowSide = p => (
	<article className="order-book-row-side">
		{(p.orders || []).map((order, i) => {
			const shares = setShareDenomination(getValue(order, 'shares.formatted'), p.selectedShareDenomination);
			const price = getValue(order, 'price.formatted');

			return (
				<div
					key={i}
					className="order-book-side-row"
				>
					<ValueDenomination formatted={shares} />
					<ValueDenomination formatted={price} />
				</div>
			);
		})}
	</article>
);

export default OrderBookRowSide;
