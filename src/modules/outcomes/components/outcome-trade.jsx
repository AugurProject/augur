import React, { Component, PropTypes } from 'react';

import Input from 'modules/common/components/input';
import OutcomeTradeSummary from 'modules/outcomes/components/outcome-trade-summary';
import OutcomeTradeAction from 'modules/outcomes/components/outcome-trade-action';
import ComponentNav from 'modules/common/components/component-nav';
import EmDash from 'modules/common/components/em-dash';

import { SHARE, MICRO_SHARE, MILLI_SHARE } from 'modules/market/constants/share-denominations';
import { BUY, SELL } from 'modules/outcomes/constants/trade-types';
import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

export default class OutcomeTrade extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timestamp: Date.now(), // Utilized to force a re-render and subsequent update of the input fields' values on `selectedOutcome` change
			shareInputPlaceholder: generateShareInputPlaceholder(this.props.selectedShareDenomination),
			maxSharesDenominated: denominateShares(getValue(this.props, 'selectedOutcome.trade.maxNumShares.value', SHARE, this.props.selectedShareDenomination)), // NOTE -- this value is not currently used in the component, but may be used later, so leaving here until this decision is finalized
			sharesDenominated: denominateShares(getValue(this.props, 'selectedOutcome.trade.numShares'), SHARE, this.props.selectedShareDenomination)
		};

		this.updateSelectedNav = this.updateSelectedNav.bind(this);
		this.handleSharesInput = this.handleSharesInput.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const oldTrade = JSON.stringify(getValue(this.props, 'selectedOutcome.trade'));
		const newTrade = JSON.stringify(getValue(nextProps, 'selectedOutcome.trade'));

		if (newTrade !== oldTrade || this.props.selectedShareDenomination !== nextProps.selectedShareDenomination) {
			this.setState({
				shareInputPlaceholder: generateShareInputPlaceholder(nextProps.selectedShareDenomination),
				maxSharesDenominated: denominateShares(getValue(nextProps, 'selectedOutcome.trade.maxNumShares.value', SHARE, nextProps.selectedShareDenomination)),
				sharesDenominated: denominateShares(getValue(nextProps, 'selectedOutcome.trade.numShares'), SHARE, nextProps.selectedShareDenomination)
			});
		}

		const oldID = getValue(this.props, 'selectedOutcome.id');
		const newID = getValue(nextProps, 'selectedOutcome.id');

		if (oldID !== newID) {
			this.setState({ timestamp: Date.now() }); // forces re-render of trade component via key value
		}
	}

	updateSelectedNav(selectedTradeSide, id) {
		this.props.updateSelectedTradeSide(selectedTradeSide, id);

		const trade = getValue(this.props, 'selectedOutcome.trade');
		if (trade && trade.updateTradeOrder) {
			trade.updateTradeOrder(null, null, selectedTradeSide);
		}
	}

	handleSharesInput(value) {
		const trade = getValue(this.props, 'selectedOutcome.trade');
		const valueDenominated = denominateShares(value, this.props.selectedShareDenomination, SHARE);

		trade.updateTradeOrder(valueDenominated, null, trade.side);
	}

	render() {
		const p = this.props;
		const s = this.state;

		const selectedID = getValue(p, 'selectedOutcome.id');
		const name = getValue(p, 'selectedOutcome.name');
		const trade = getValue(p, 'selectedOutcome.trade');
		const selectedTradeSide = (selectedID && p.selectedTradeSide[selectedID]) || BUY;
		const tradeOrder = getValue(p, 'tradeSummary.tradeOrders').find(order => order.data.outcomeID === selectedID);
		const hasFunds = getValue(p, 'tradeSummary.hasUserEnoughFunds');

		console.log('p -- ', selectedID);

		return (
			<article className="outcome-trade">
				{p.marketType !== SCALAR ?
					<h3>Create Order <EmDash /> {name && name}</h3> :
					<h3>Create Order</h3>
				}
				{trade &&
					<div
						key={s.timestamp}
						className="outcome-trade-inputs"
					>
						<div className="outcome-trade-inputs-sides">
							<ComponentNav
								navItems={{ [BUY]: { label: BUY }, [SELL]: { label: SELL } }}
								selectedNav={selectedTradeSide}
								updateSelectedNav={(side) => { this.updateSelectedNav(side, selectedID); }}
							/>
						</div>
						<div className="outcome-trade-inputs-fields">
							<Input
								placeholder={s.shareInputPlaceholder}
								type="number"
								value={s.sharesDenominated}
								min="0"
								step="0.1"
								onChange={(value) => { this.handleSharesInput(value); }}
							/>
							<span>@</span>
							<Input
								placeholder="Price"
								type="number"
								value={trade.limitPrice}
								step="0.1"
								max={p.maxValue}
								onChange={(value) => { trade.updateTradeOrder(null, value, trade.side); }}
							/>
						</div>
					</div>
				}
				{tradeOrder &&
					<OutcomeTradeSummary
						trade={trade}
						tradeOrder={tradeOrder}
					/>
				}
				{tradeOrder &&
					<OutcomeTradeAction
						hasFunds={hasFunds}
						selectedID={selectedID}
						submitTrade={p.submitTrade}
					/>
				}
			</article>
		);
	}
}

OutcomeTrade.propTypes = {
	selectedShareDenomination: PropTypes.string,
	updateSelectedTradeSide: PropTypes.func
};

function denominateShares(shares, fromDenomination, toDenomination) {
	if (shares == null || fromDenomination === toDenomination) {
		return shares;
	}

	// Determine numerical representation of from/to values for shares mutation calc
	const options = [SHARE, MILLI_SHARE, MICRO_SHARE];
	let fromValue = 0;
	options.some((value, i) => {
		if (value === fromDenomination) {
			fromValue = i;
			return true;
		}

		return false;
	});

	let toValue = 0;
	options.some((value, i) => {
		if (value === toDenomination) {
			toValue = i;
			return true;
		}

		return false;
	});

	if (fromValue === toValue) {
		return shares;
	} else	if (fromValue < toValue) {
		return shares * Math.pow(1000, toValue - fromValue);
	}

	// fromValue > toValue
	return shares / Math.pow(1000, Math.abs(toValue - fromValue));
}

function generateShareInputPlaceholder(denomination) {
	const base = 'Quantity';

	switch (denomination) {
		case (MICRO_SHARE):
			return `${base} (μShare)`;
		case (MILLI_SHARE):
			return `${base} (mShare)`;
		default:
		case (SHARE):
			return base;
	}
}
