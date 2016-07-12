import React from 'react';

import OpenOrder from '../../open-orders/components/open-order';

const OpenOrders = (p) => (
	<div className="open-orders">
		<table>
			<tbody>
				<tr>
					<th>Type</th>
					<th>Qty.</th>
					<th>Price</th>
					<th>Matched</th>
					<th>Unmatched</th>
				</tr>
				{
					p.openOrders.map(openOrder => (
						<OpenOrder
							key={openOrder.id}
							{...openOrder}
							onCancelOrder={p.onCancelOrder}
						/>
						)
					)
				}
			</tbody>
		</table>
	</div>
);

OpenOrders.propTypes = {
	openOrders: React.PropTypes.array
};

export default OpenOrders;
