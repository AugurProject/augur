import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';
import NullStateMessage from 'modules/common/components/null-state-message';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

const OrderBookRowSide = (p) => {
	const orders = getValue(p, 'orders');
	const nullMessage = 'No Orders';

	return (
		<article className="order-book-row-side">
			{!orders || !orders.length ?
				<NullStateMessage message={nullMessage} /> :
				<div>
					{(p.orders || []).map((order, i) => {
						const shares = setShareDenomination(getValue(order, 'shares.formatted'), p.selectedShareDenomination);
						const price = getValue(order, 'price.formatted');

						return (
							<div
								key={i}
								className="order-book-side-row not-selectable"
							>
								<ValueDenomination formatted={shares} />
								<ValueDenomination formatted={price} />
							</div>
						);
					})}
				</div>
			}
		</article>
	);
};

export default OrderBookRowSide;
