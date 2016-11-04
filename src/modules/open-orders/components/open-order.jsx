import React from 'react';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import ValueDenomination from '../../common/components/value-denomination';

const OpenOrder = p => (
	<tr className={classnames('open-order', { 'is-disabled': p.status === p.cancellationStatuses.CANCELLED, first: p.isFirst })}>
		<td className="outcome-name">
			{p.outcomeName}
		</td>
		<td className="type">
			{p.type}
		</td>
		<td className="shares">
			<ValueDenomination {...p.unmatchedShares} />
		</td>
		<td className="price">
			<ValueDenomination {...p.avgPrice} />
		</td>
		<td className="cancel">
			{
				renderCancelNode(p.id, p.marketID, p.type, p.status, p.cancellationStatuses, p.cancelOrder, p.abortCancelOrderConfirmation, p.showCancelOrderConfirmation)
			}
		</td>
	</tr>
);

OpenOrder.propTypes = {
	id: React.PropTypes.string.isRequired,
	marketID: React.PropTypes.string.isRequired,
	outcomeName: React.PropTypes.string.isRequired,
	type: React.PropTypes.string.isRequired,
	avgPrice: React.PropTypes.object.isRequired,
	unmatchedShares: React.PropTypes.object.isRequired,
	cancellationStatuses: React.PropTypes.object.isRequired,
	status: React.PropTypes.string,
	abortCancelOrderConfirmation: React.PropTypes.func.isRequired,
	showCancelOrderConfirmation: React.PropTypes.func.isRequired,
	cancelOrder: React.PropTypes.func.isRequired,
	isFirst: React.PropTypes.bool.isRequired
};

function renderCancelNode(orderID, marketID, type, status, cancellationStatuses, cancelOrder, abortCancelOrderConfirmation, showCancelOrderConfirmation) {
	switch (status) {
		case cancellationStatuses.CANCELLATION_CONFIRMATION:
			return (
				<span>
					<button
						className="button cancel-order-abort-confirmation"
						data-tip="No, don't cancel order"
						onClick={(event) => {
							console.log(event);
							console.log('clicked NO:', orderID, marketID, type);
							abortCancelOrderConfirmation(orderID, marketID, type);
						}}
					>No</button>
					<button
						className="button cancel-order-action"
						data-tip="Yes, cancel order"
						onClick={(event) => {
							console.log(event);
							console.log('clicked YES:', orderID, marketID, type);
							cancelOrder(orderID, marketID, type);
						}}
					>Yes</button>
					<ReactTooltip type="light" effect="solid" place="top" />
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
				<span>
					<button
						className="button cancel-order-action"
						data-tip="Cancel order"
						onClick={(event) => {
							showCancelOrderConfirmation(orderID, marketID, type);
						}}
					>
						Cancel
					</button>
					<ReactTooltip type="light" effect="solid" place="top" />
				</span>
			);
	}

}

export default OpenOrder;
