import React from 'react';

import OpenOrdersGroup from '../../open-orders/components/open-orders-group';

const OpenOrders = (p) => (
	<div className="open-orders">
		<h2>Open orders</h2>
		{
			p.outcomes.map(outcome => {
				if (outcome.openOrders.items.length === 0) {
					return (<div>No open orders</div>);
				}

				return (
					<OpenOrdersGroup
						key={outcome.id}
						name={outcome.name}
						openOrders={outcome.openOrders}
					/>
				);
			})
		}
	</div>
);

OpenOrders.propTypes = {
	outcomes: React.PropTypes.array
};

export default OpenOrders;
