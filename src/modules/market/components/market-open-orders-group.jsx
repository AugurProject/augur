import React from 'react';

import MarketOpenOrdersRow from 'modules/market/components/market-open-orders-row';

const MarketOpenOrdersGroup = p => (
	<article className="market-open-orders-group">
		{(p.userOpenOrders || []).map((order, i) => (
			<MarketOpenOrdersRow
				key={order.id}
				isFirst={i === 0}
				{...order}
				name={p.name}
				marketType={p.marketType}
				lastPricePercent={p.lastPricePercent}
				status={p.orderCancellation[order.id]}
				cancellationStatuses={p.orderCancellation.cancellationStatuses}
				cancelOrder={p.orderCancellation.cancelOrder}
				abortCancelOrderConfirmation={p.orderCancellation.abortCancelOrderConfirmation}
				showCancelOrderConfirmation={p.orderCancellation.showCancelOrderConfirmation}
				selectedShareDenomination={p.selectedShareDenomination}
			/>
		))}
	</article>
);

export default MarketOpenOrdersGroup;
