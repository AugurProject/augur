import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';
import OutcomeTradeSummary from 'modules/outcomes/components/outcome-trade-summary';
import OutcomeTradeAction from 'modules/outcomes/components/outcome-trade-action';
import ComponentNav from 'modules/common/components/component-nav';
import EmDash from 'modules/common/components/em-dash';

import { SHARE, MICRO_SHARE, MILLI_SHARE } from 'modules/market/constants/share-denominations';
import { BUY } from 'modules/outcomes/constants/trade-types';
import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

export default class OutcomeTrade extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timestamp: Date.now(), // Utilized to force a re-render and subsequent update of the input fields' values on `selectedOutcome` change
			shareInputPlaceholder: generateShareInputPlaceholder(props.selectedShareDenomination),
			maxSharesDenominated: denominateShares(getValue(props, 'selectedOutcome.trade.maxNumShares.value', SHARE, props.selectedShareDenomination)), // NOTE -- this value is not currently used in the component, but may be used later, so leaving here until this decision is finalized
			sharesDenominated: denominateShares(getValue(props, 'selectedOutcome.trade.numShares'), SHARE, props.selectedShareDenomination),
			minLimitPrice: props.marketType && props.marketType === SCALAR ? props.minLimitPrice : 0,
			maxLimitPrice: props.marketType && props.marketType === SCALAR ? props.maxLimitPrice : 1,
			isSharesValueValid: true,
			isLimitPriceValueValid: true,
		};

		this.updateSelectedNav = this.updateSelectedNav.bind(this);
		this.handleSharesInput = this.handleSharesInput.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.marketType !== nextProps.markettype) {
			this.setState({
				minLimitPrice: nextProps.marketType && nextProps.marketType === SCALAR ? nextProps.minLimitPrice : 0,
				maxLimitPrice: nextProps.marketType && nextProps.marketType === SCALAR ? nextProps.maxLimitPrice : 1
			});
		}

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
		const oldPrice = getValue(this.props, 'selectedOutcome.trade.limitPrice');
		const newPrice = getValue(nextProps, 'selectedOutcome.trade.limitPrice');
		const oldNumShares = getValue(this.props, 'selectedOutcome.trade.numShares');
		const newNumShares = getValue(nextProps, 'selectedOutcome.trade.numShares');

		if (oldID !== newID || oldPrice !== newPrice || oldNumShares !== newNumShares) {
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


		return (
			<article className="outcome-trade market-content-scrollable">
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
								navItems={p.outcomeTradeNavItems}
								selectedNav={selectedTradeSide}
								updateSelectedNav={(side) => { this.updateSelectedNav(side, selectedID); }}
							/>
						</div>
						<div className="outcome-trade-inputs-fields">
							<Input
								className={classNames({ 'input-error': !s.isSharesValueValid })}
								placeholder={s.shareInputPlaceholder}
								type="number"
								value={s.sharesDenominated}
								min="0"
								step="0.1"
								onChange={(value) => {
									if (value != null) {
										if (value >= 0 || value === '') {
											this.handleSharesInput(value);
											this.setState({ isSharesValueValid: true });
										} else {
											this.setState({ isSharesValueValid: false });
										}
									}
								}}
							/>
							<span>@</span>
							<Input
								className={classNames({ 'input-error': !s.isLimitPriceValueValid })}
								placeholder="Price"
								type="number"
								value={trade.limitPrice}
								step="0.1"
								min={s.minLimitPrice}
								max={s.maxLimitPrice}
								onChange={(value) => {
									if (value != null) {
										if ((value >= parseFloat(s.minLimitPrice) && value <= parseFloat(s.maxLimitPrice)) || value === '') {
											trade.updateTradeOrder(null, value, trade.side);
											this.setState({ isLimitPriceValueValid: true });
										} else {
											this.setState({ isLimitPriceValueValid: false });
										}
									}
								}}
							/>
						</div>
					</div>
				}
				{!s.isSharesValueValid &&
					<span className="outcome-trade-input-error-message" >
						{`Shares amount must be greater than 0.`}
					</span>
				}
				{!s.isLimitPriceValueValid &&
					<span className="outcome-trade-input-error-message" >
						{`Limit price must be between ${s.minLimitPrice} - ${s.maxLimitPrice}.`}
					</span>
				}
				{tradeOrder && s.isSharesValueValid && s.isLimitPriceValueValid &&
					<OutcomeTradeSummary
						trade={trade}
						tradeOrder={tradeOrder}
					/>
				}
				{tradeOrder && s.isSharesValueValid && s.isLimitPriceValueValid &&
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
	updateSelectedTradeSide: PropTypes.func,
	marketType: PropTypes.string,
	minLimitPrice: PropTypes.string,
	maxLimitPrice: PropTypes.string
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
		return shares * (1000**(toValue - fromValue));
	}

	// fromValue > toValue
	return shares / (1000**Math.abs(toValue - fromValue));
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
