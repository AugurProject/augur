/*
 * Author: priecint
 */

import React from 'react';

import OpenOrder from '../../open-orders/components/open-order';

const OpenOrdersGroup = (p) => (
	<div>
		<table>
			<tbody>
				<tr>
					<th>Outcome</th>
					<th>Type</th>
					<th>Shares</th>
					<th>Price</th>
					<th>&nbsp;</th>
				</tr>
				{
					p.userOpenOrders.map(openOrder => (
						<OpenOrder
							key={openOrder.id}
							outcomeName={p.name}
							{...openOrder}
							cancelOrder={p.cancelOrder}
						/>
						)
					)
				}
			</tbody>
		</table>
	</div>
);

OpenOrdersGroup.propTypes = {
	userOpenOrders: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	name: React.PropTypes.string.isRequired,
	cancelOrder: React.PropTypes.func.isRequired
};

export default OpenOrdersGroup;
