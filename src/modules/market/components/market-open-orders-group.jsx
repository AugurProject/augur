import React from 'react';

import MarketOpenOrdersRow from 'modules/market/components/market-open-orders-row';

const MarketOpenOrdersGroup = (p) => {

	return (
		<article className="market-open-orders-group">
			<span>{p.name}</span>
			{(p.userOpenOrders || []).map((order, i) => (
				<MarketOpenOrdersRow
					key={order.id}
					isFirst={p.isFirst && i === 0}
					{...order}
					outcomeName={p.name}
					status={p.orderCancellation[order.id]}
					cancellationStatuses={p.orderCancellation.cancellationStatuses}
					cancelOrder={p.orderCancellation.cancelOrder}
					abortCancelOrderConfirmation={p.orderCancellation.abortCancelOrderConfirmation}
					showCancelOrderConfirmation={p.orderCancellation.showCancelOrderConfirmation}
				/>
			))}
		</article>
	);
};

export default MarketOpenOrdersGroup;
