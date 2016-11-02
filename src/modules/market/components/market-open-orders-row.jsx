import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';

const MarketOpenOrdersRow = (p) => {
	return (
		<article className="market-open-orders-row">
			<span>{p.type}</span>
			<ValueDenomination {...p.unmatchedShares} />
			<ValueDenomination {...p.avgPrice} />
			<span>{renderCancelNode(p.id, p.marketID, p.type, p.status, p.cancellationStatuses, p.cancelOrder, p.abortCancelOrderConfirmation, p.showCancelOrderConfirmation)}</span>
		</article>
	)
};

export default MarketOpenOrdersRow;

function renderCancelNode(orderID, marketID, type, status, cancellationStatuses, cancelOrder, abortCancelOrderConfirmation, showCancelOrderConfirmation) {
	switch (status) {
		case cancellationStatuses.CANCELLATION_CONFIRMATION:
			return (
				<span>
					<button
						className="button cancel-order-abort-confirmation"
						title="No, don't cancel order"
						onClick={(event) => {
							console.log(event);
							console.log('clicked NO:', orderID, marketID, type);
							abortCancelOrderConfirmation(orderID, marketID, type);
						}}
					>No</button>
					<button
						className="button cancel-order-action"
						title="Yes, cancel order"
						onClick={(event) => {
							console.log(event);
							console.log('clicked YES:', orderID, marketID, type);
							cancelOrder(orderID, marketID, type);
						}}
					>Yes</button>
				</span>
			);
		case cancellationStatuses.CANCELLING:
			return 'Cancelling';
		case cancellationStatuses.CANCELLATION_FAILED:
			return 'Failure';
		case cancellationStatuses.CANCELLED:
			return null;
		default:
			return (
				<button
					className="button cancel-order-action"
					title="Cancel order"
					onClick={(event) => {
						showCancelOrderConfirmation(orderID, marketID, type);
					}}
				>
					Cancel
				</button>
			);
	}
}
