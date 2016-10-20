import React from 'react';

import OpenOrder from 'modules/open-orders/components/open-order';

const OpenOrdersGroup = (p) => {
	if (p.userOpenOrders == null || p.userOpenOrders.length === 0) {
		return null;
	}

	return (
		<tbody>
			{p.userOpenOrders.map((openOrder, index) =>
				<OpenOrder
					key={openOrder.id}
					isFirst={p.isFirst && index === 0}
					{...openOrder}
					outcomeName={p.name}
					status={p.orderCancellation[openOrder.id]}
					cancellationStatuses={p.orderCancellation.cancellationStatuses}
					cancelOrder={p.orderCancellation.cancelOrder}
					abortCancelOrderConfirmation={p.orderCancellation.abortCancelOrderConfirmation}
					showCancelOrderConfirmation={p.orderCancellation.showCancelOrderConfirmation}
				/>
			)}
		</tbody>
	);
};

// TODO -- Prop Validations
// OpenOrdersGroup.propTypes = {
// 	userOpenOrders: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
// 	name: React.PropTypes.string.isRequired,
// 	orderCancellation: React.PropTypes.object.isRequired,
// 	isFirst: React.PropTypes.bool.isRequired
// };

export default OpenOrdersGroup;
