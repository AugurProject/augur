/*
 * Author: priecint
 */

import React from 'react';

import OpenOrder from '../../open-orders/components/open-order';

const OpenOrdersGroup = (p) => {
	if (p.userOpenOrders == null || p.userOpenOrders.length === 0) {
		return null;
	}

	return (
		<table className="open-orders-group">
			<tbody>
				<tr>
					<th className="outcome-name">Outcome</th>
					<th className="type">Type</th>
					<th className="shares">Shares</th>
					<th className="price">Price</th>
					<th className="cancel">&nbsp;</th>
				</tr>
				{p.userOpenOrders.map(openOrder =>
					<OpenOrder
						{...openOrder}
						key={openOrder.id}
						outcomeName={p.name}
						status={p.orderCancellation[openOrder.id]}
						cancellationStatuses={p.orderCancellation.cancellationStatuses}
						cancelOrder={p.orderCancellation.cancelOrder}
						abortCancelOrderConfirmation={p.orderCancellation.abortCancelOrderConfirmation}
						showCancelOrderConfirmation={p.orderCancellation.showCancelOrderConfirmation}
					/>
				)}
			</tbody>
		</table>
	);
};

OpenOrdersGroup.propTypes = {
	userOpenOrders: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	name: React.PropTypes.string.isRequired,
	orderCancellation: React.PropTypes.object.isRequired
};

export default OpenOrdersGroup;
