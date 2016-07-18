/*
 * Author: priecint
 */

import React from 'react';

import Collapse from '../../common/components/collapse';
import Clickable from '../../common/components/clickable';

import OpenOrder from '../../open-orders/components/open-order';

const OpenOrdersGroup = (p) => (
	<div>
		<Clickable component="h3" onClick={(event) => p.userOpenOrders.updateSelectedOpenOrdersGroup(p.id)}>
			{p.name}
		</Clickable>

		<Collapse isOpen={p.id === p.userOpenOrders.selectedUserOpenOrdersGroup}>
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
						p.userOpenOrders.items.map(openOrder => (
							<OpenOrder
								key={openOrder.id}
								{...openOrder}
								cancelOrder={p.userOpenOrders.cancelOrder}
							/>
							)
						)
					}
				</tbody>
			</table>
		</Collapse>
	</div>
);

OpenOrdersGroup.propTypes = {
	userOpenOrders: React.PropTypes.object,
	name: React.PropTypes.string
};

export default OpenOrdersGroup;
