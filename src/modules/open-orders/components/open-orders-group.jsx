/*
 * Author: priecint
 */

import React from 'react';

import Collapse from '../../common/components/collapse';
import Clickable from '../../common/components/clickable';

import OpenOrder from '../../open-orders/components/open-order';

const OpenOrdersGroup = (p) => (
	<div>
		<Clickable component="h3" onClick={(event) => p.openOrders.toggleGroupOpen()}>
			{p.name}
		</Clickable>

		<Collapse isOpen={p.openOrders.isMarketOpenOrdersOpen}>
			<table>
				<tbody>
					<tr>
						<th>Type</th>
						<th>Shares</th>
						<th>Price</th>
						<th>Matched</th>
						<th>Unmatched</th>
						<th>&nbsp;</th>
					</tr>
					{
						p.openOrders.items.map(openOrder => (
								<OpenOrder
									key={openOrder.id}
									{...openOrder}
									onCancelOrder={p.openOrders.onCancelOrder}
								/>
							)
						)
					}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan="5">
							{
								p.openOrders.items.length > 0 &&
								<button className="button" onClick={(event) => {
									p.openOrders.onCancelAllOrders();
								}}>
									Cancel all
								</button>
							}
							{
								p.openOrders.bidsCount > 0 &&
								<button className="button" onClick={(event) => {
									p.openOrders.onCancelAllBids();
								}}>
									Cancel all bids
								</button>
							}
							{
								p.openOrders.asksCount > 0 &&
								<button className="button" onClick={(event) => {
									p.openOrders.onCancelAllAsks();
								}}>
									Cancel all asks
								</button>
							}
						</td>
					</tr>
				</tfoot>
			</table>
		</Collapse>
	</div>
);

OpenOrdersGroup.propTypes = {
	openOrders: React.PropTypes.object,
	name: React.PropTypes.string
};

export default OpenOrdersGroup;