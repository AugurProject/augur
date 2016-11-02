import React from 'react';

import MarketOpenOrdersGroup from 'modules/market/components/market-open-orders-group';

const MarketOpenOrders = p => (
	<article className="market-open-orders">
		<div className="market-open-orders-header">
			<span>Outcomes</span>
			<span>Type</span>
			<span>Shares</span>
			<span>Price</span>
			<span>Action</span>
		</div>
		{
			(p.outcomes || []).map((outcome, index) => (
				<MarketOpenOrdersGroup
					key={outcome.name}
					id={outcome.id}
					name={outcome.name}
					userOpenOrders={outcome.userOpenOrders}
					orderCancellation={p.orderCancellation}
				/>
			))
		}
	</article>
);

// TODO -- Prop Validations
// OpenOrders.propTypes = {
// 	userOpenOrdersSummary: React.PropTypes.object,
// 	outcomes: React.PropTypes.array,
// 	orderCancellation: React.PropTypes.object.isRequired
// };

export default MarketOpenOrders;
