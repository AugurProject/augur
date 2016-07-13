import React from 'react';

import OpenOrder from '../../open-orders/components/open-order';

const OpenOrders = (p) => (
	<div className="open-orders">
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
				{
					p.openOrders.items.length > 0 &&
						<button className="button" onClick={(event) => { p.openOrders.onCancelAllOrders(); }}>
							Cancel all
						</button>
				}
				{
					p.openOrders.bidsCount > 0 &&
						<button className="button" onClick={(event) => { p.openOrders.onCancelAllBids(); }}>
							Cancel all bids
						</button>
				}
				{
					p.openOrders.asksCount > 0 &&
						<button className="button" onClick={(event) => { p.openOrders.onCancelAllAsks(); }}>
							Cancel all asks
						</button>
				}
			</tfoot>
		</table>
	</div>
);

OpenOrders.propTypes = {
	openOrders: React.PropTypes.object
};

export default OpenOrders;
