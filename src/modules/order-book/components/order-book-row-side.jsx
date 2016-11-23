import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';
import NullStateMessage from 'modules/common/components/null-state-message';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

import { BUY, SELL } from 'modules/outcomes/constants/trade-types';
import { BID, ASK } from 'modules/transactions/constants/types';
import { PRICE, SHARE } from 'modules/order-book/constants/order-book-value-types';

const OrderBookRowSide = (p) => {
	const orders = getValue(p, 'orders');
	const nullMessage = 'No Orders';
	const side = p.type || ASK;
	const shouldHighlight = (side === BID && p.selectedTradeSide[p.id] === SELL) || (side !== BID && p.selectedTradeSide[p.id] === BUY);

	return (
		<article className={`order-book-row-side ${shouldHighlight ? 'order-book-row-side-trading' : ''}`}>
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
								<button
									className="unstyled"
									onClick={() => {
										p.updateTradeFromSelectedOrder(p.id, i, side, side === BID ? SHARE : PRICE);
									}}
								>
									<ValueDenomination formatted={side === BID ? shares : price} />
								</button>
								<button
									className="unstyled"
									onClick={() => {
										p.updateTradeFromSelectedOrder(p.id, i, side, side === BID ? PRICE : SHARE);
									}}
								>
									<ValueDenomination formatted={p.type === BID ? price : shares} />
								</button>
							</div>
						);
					})}
				</div>
			}
		</article>
	);
};

export default OrderBookRowSide;
