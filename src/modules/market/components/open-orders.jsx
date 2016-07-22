import React from 'react';

import OpenOrdersGroup from '../../open-orders/components/open-orders-group';

const OpenOrders = (p) => {
	const hasOpenOrders = p.userOpenOrdersSummary != null && p.userOpenOrdersSummary.openOrdersCount > 0;
	const title = hasOpenOrders ? `${p.userOpenOrdersSummary.openOrdersCount} Open Orders` : 'No Open Orders';
	return (
		<div className="open-orders">
			<h2>{title}</h2>
			{
				p.outcomes.map(outcome => {
					if (outcome.userOpenOrders == null || outcome.userOpenOrders.length === 0) {
						return null;
					}

					return (
						<OpenOrdersGroup
							key={outcome.id}
							id={outcome.id}
							name={outcome.name}
							userOpenOrders={outcome.userOpenOrders}
							cancelOrder={p.cancelOrder}
						/>
					);
				})
			}
		</div>
	);
};

OpenOrders.propTypes = {
	userOpenOrdersSummary: React.PropTypes.object,
	outcomes: React.PropTypes.array,
	updateSelectedUserOpenOrdersGroup: React.PropTypes.func.isRequired,
	cancelOrder: React.PropTypes.func.isRequired,
	selectedUserOpenOrdersGroupID: React.PropTypes.string
};

export default OpenOrders;
