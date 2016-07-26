import React from 'react';

import OpenOrdersSummary from '../../open-orders/components/open-orders-summary';
import OpenOrdersGroup from '../../open-orders/components/open-orders-group';

const OpenOrders = (p) => (
	<div className="market-open-orders">
		<OpenOrdersSummary
			userOpenOrdersSummary={p.userOpenOrdersSummary}
		/>

		<div className="open-orders-list">
			{
				p.outcomes.map(outcome => (
					<OpenOrdersGroup
						key={outcome.id}
						id={outcome.id}
						name={outcome.name}
						userOpenOrders={outcome.userOpenOrders}
						cancelOrder={p.cancelOrder}
					/>
				))
			}
		</div>
	</div>
);

OpenOrders.propTypes = {
	userOpenOrdersSummary: React.PropTypes.object,
	outcomes: React.PropTypes.array,
	cancelOrder: React.PropTypes.func.isRequired
};

export default OpenOrders;
