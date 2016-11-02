import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';

const MarketOpenOrdersRow = (p) => {
	console.log('is First -- ', p);

	return (
		<article className={`market-open-orders-row ${p.isFirst ? 'isFirst' : ''}`} >
			<span>{p.isFirst && p.name}</span>
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
						className="unstyled no confirm"
						onClick={(event) => { abortCancelOrderConfirmation(orderID, marketID, type); }}
					>
						No
					</button>
					<button
						className="unstyled yes confirm"
						onClick={(event) => {
							cancelOrder(orderID, marketID, type);
						}}
					>
						Yes
					</button>
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
					className="unstyled cancel"
					onClick={(event) => {
						showCancelOrderConfirmation(orderID, marketID, type);
					}}
				>
					<i></i> cancel
				</button>
			);
	}
}
