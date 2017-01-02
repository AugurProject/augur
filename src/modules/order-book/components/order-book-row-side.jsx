import React from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

import ValueDenomination from 'modules/common/components/value-denomination';
import NullStateMessage from 'modules/common/components/null-state-message';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

import { BUY, SELL } from 'modules/outcomes/constants/trade-types';
import { BID, ASK } from 'modules/transactions/constants/types';
import { PRICE, SHARE } from 'modules/order-book/constants/order-book-value-types';

const OrderBookRowSide = (p) => {
	const orders = getValue(p, 'orders');
	const trade = getValue(p, 'trade');
	const nullMessage = 'No Orders';
	const side = p.type || ASK;
	const shouldHighlight = (side === BID && p.selectedTradeSide[p.id] === SELL) || (side !== BID && p.selectedTradeSide[p.id] === BUY) || (side !== BID && p.selectedTradeSide[p.id] == null);

	// console.log('outcome trade -- ', p);

	return (
		<article className={`order-book-row-side ${shouldHighlight ? 'order-book-row-side-trading' : ''}`}>
			{!orders || !orders.length ?
				<NullStateMessage message={nullMessage} /> :
				<div>
					{(p.orders || []).map((order, i) => {
						const shares = setShareDenomination(getValue(order, 'shares.formatted'), p.selectedShareDenomination);
						const sharesValue = getValue(order, 'shares.value');
						const price = getValue(order, 'price.formatted');
						const priceValue = getValue(order, 'price.value');
						const type = p.type || ASK;

						return (
							<div
								key={i}
								className={classNames('order-book-side-row not-selectable', { 'is-of-current-user': order.isOfCurrentUser })}
								data-tip
								data-for={`${type}-${i}-orders`}
								data-event="mouseenter"
								data-event-off="mouseleave"
							>
								<button
									className="unstyled"
									onClick={() => {
										if (side !== BID) {
											trade.updateTradeOrder('', null, side); // Clear the shares
										}
										trade.updateTradeOrder(side === BID ? sharesValue : null, priceValue, side);
									}}
								>
									<ValueDenomination formatted={side === BID ? shares : price} />
								</button>
								<button
									className="unstyled"
									onClick={() => {
										if (side === BID) {
											trade.updateTradeOrder('', null, side); // Clear the shares
										}
										trade.updateTradeOrder(side === BID ? null : sharesValue, priceValue, side);
									}}
								>
									<ValueDenomination formatted={side === BID ? price : shares} />
								</button>
								{order.isOfCurrentUser &&
									<ReactTooltip
										id={`${type}-${i}-orders`}
										type="info"
										effect="solid"
										place="top"
									>
										<span className="tooltip-text">
											Your Order
										</span>
									</ReactTooltip>
								}
							</div>
						);
					})}
				</div>
			}
		</article>
	);
};

export default OrderBookRowSide;
