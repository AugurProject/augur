import React from 'react';

import OpenOrdersGroup from '../../open-orders/components/open-orders-group';

const OpenOrders = (p) => (
	<div className="open-orders">
		<h2>Open orders</h2>
		{
			p.outcomes.map(outcome => {
				if (outcome.userOpenOrders.items.length === 0) {
					return null;
				}

				return (
					<OpenOrdersGroup
						key={outcome.id}
						id={outcome.id}
						name={outcome.name}
						userOpenOrders={outcome.userOpenOrders}
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
