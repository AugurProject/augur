import React, { Component, PropTypes } from 'react';

import EmDash from 'modules/common/components/em-dash';

import { POSITION, ORDER } from 'modules/market/constants/trade-close-type';

export default class MarketTradeCloseDialog extends Component {
	static propTypes = {
		status: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.state = {
			isConfirming: false,
			status: props.status
		};
	}

	render() {
		const p = this.props;
		const s = this.state;

		// Position -- No Available Actions
		if (p.closeType === POSITION && !parseFloat(p.quantityOfShares, 10)) {
			return <EmDash />;
		}

		if (s.isConfirming) {
			return (
				<span>
					<button
						className="unstyled no confirm"
						onClick={() => {
							this.setState({ isConfirming: false });
						}}
					>
						No
					</button>
					<button
						className="unstyled yes confirm"
						onClick={(event) => {
							if (p.closeType === POSITION) {
								p.closePosition(p.marketID, p.outcomeID);
							} else if (p.closeType === ORDER) {
								console.log('TODO, cancel order');
								// cancelOrder(orderID, marketID, type);
							}
							this.setState({ isConfirming: false });
						}}
					>
						Yes
					</button>
				</span>
			)
		}

		switch (status) {
			default:
				return (
					<button
						className="unstyled cancel"
						onClick={() => {
							this.setState({ isConfirming: true });
						}}
					>
						<i></i> { p.closeType === POSITION ? 'close' : 'cancel' }
					</button>
				)
		}
	}
}

// function renderCloseDialog(marketID, outcomeID, quantityOfShares, status, closePosition) {
// 	if (!parseFloat(quantityOfShares, 10)) { // Position currently has no shares
// 		return <EmDash />;
// 	}
// 	// switch (status) {
// 	// 	case cancellationStatuses.CANCELLATION_CONFIRMATION:
// 	// 		return (
// 	// 			<span>
// 	// 				<button
// 	// 					className="unstyled no confirm"
// 	// 					onClick={(event) => { abortCancelOrderConfirmation(orderID, marketID, type); }}
// 	// 				>
// 	// 					No
// 	// 				</button>
// 	// 				<button
// 	// 					className="unstyled yes confirm"
// 	// 					onClick={(event) => {
// 	// 						cancelOrder(orderID, marketID, type);
// 	// 					}}
// 	// 				>
// 	// 					Yes
// 	// 				</button>
// 	// 			</span>
// 	// 		);
// 	// 	case cancellationStatuses.CANCELLING:
// 	// 		return 'Cancelling';
// 	// 	case cancellationStatuses.CANCELLATION_FAILED:
// 	// 		return 'Failure';
// 	// 	case cancellationStatuses.CANCELLED:
// 	// 		return null;
// 	// 	default:
// 	// 		return (
// 	// 			<button
// 	// 				className="unstyled cancel"
// 	// 				onClick={(event) => {
// 	// 					showCancelOrderConfirmation(orderID, marketID, type);
// 	// 				}}
// 	// 			>
// 	// 				<i></i> cancel
// 	// 			</button>
// 	// 		);
// 	// }
// }
