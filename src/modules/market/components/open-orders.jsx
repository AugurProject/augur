import React from 'react';

import OpenOrdersGroup from '../../open-orders/components/open-orders-group';

const OpenOrders = (p) => (
	<div className="open-orders">
		<h2>Open orders</h2>
		{
			p.outcomes.map(outcome => {
				if (outcome.userOpenOrders.length === 0) {
					return null;
				}

				return (
					<OpenOrdersGroup
						key={outcome.id}
						id={outcome.id}
						name={outcome.name}
						userOpenOrders={outcome.userOpenOrders}
						selectedUserOpenOrdersGroupID={p.selectedUserOpenOrdersGroupID}
						updateSelectedUserOpenOrdersGroup={p.updateSelectedUserOpenOrdersGroup}
						cancelOrder={p.cancelOrder}
					/>
				);
			})
		}
	</div>
);

OpenOrders.propTypes = {
	outcomes: React.PropTypes.array,
	updateSelectedUserOpenOrdersGroup: React.PropTypes.func.isRequired,
	cancelOrder: React.PropTypes.func.isRequired,
	selectedUserOpenOrdersGroupID: React.PropTypes.string
};

export default OpenOrders;
