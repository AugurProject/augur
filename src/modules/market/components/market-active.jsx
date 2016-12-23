import React, { Component, PropTypes } from 'react';

import MarketData from 'modules/market/components/market-data';
import MarketUserData from 'modules/market/components/market-user-data';
import OrderBook from 'modules/order-book/components/order-book';
import OutcomeTrade from 'modules/outcomes/components/outcome-trade';

import { SHARE, MILLI_SHARE, MICRO_SHARE } from 'modules/market/constants/share-denominations';
import { PRICE } from 'modules/order-book/constants/order-book-value-types';
import { BUY, SELL } from 'modules/outcomes/constants/trade-types';
import { BID } from 'modules/transactions/constants/types';
import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types';
import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

export default class MarketActive extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOutcome: this.props.market.outcomes[0],
			selectedTradeSide: {}
		};

		this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
		this.updateSelectedTradeSide = this.updateSelectedTradeSide.bind(this);
		this.determineDefaultShareDenomination = this.determineDefaultShareDenomination.bind(this);
		this.updateTradeFromSelectedOrder = this.updateTradeFromSelectedOrder.bind(this);
	}

	componentWillMount() {
		const marketType = getValue(this.props, 'market.type');

		if (marketType === SCALAR) {
			this.determineDefaultShareDenomination();
		}
	}

	componentWillReceiveProps(nextProps) {
		const selectedOutcomeID = this.state.selectedOutcome.id;
		const nextPropsOutcome = nextProps.market.outcomes.find(outcome => outcome.id === selectedOutcomeID);

		if (JSON.stringify(nextPropsOutcome) !== JSON.stringify(this.state.selectedOutcome)) {
			this.setState({ selectedOutcome: nextPropsOutcome });
		}
	}

	updateSelectedOutcome(selectedOutcome) {
		this.setState({ selectedOutcome });
	}

	updateSelectedTradeSide(selectedTradeSide, id) {
		this.setState({
			selectedTradeSide: {
				...this.state.selectedTradeSide,
				[id]: selectedTradeSide
			}
		});
	}

	updateTradeFromSelectedOrder(outcomeID, orderIndex, side, orderValueType) {
		const outcomes = getValue(this.props, 'market.outcomes');

		if (outcomes) {
			const outcome = outcomes.find(outcome => outcome.id === outcomeID);
			const orderBookSide = getValue(outcome, `orderBook.${side === BID ? BIDS : ASKS}`);
			const order = (orderBookSide && orderBookSide[orderIndex]) || null;
			const price = getValue(order, 'price.value') || '';
			const trade = outcome.trade;
			const tradeSide = side === BID ? SELL : BUY;

			if (orderValueType === PRICE) {
				trade.updateTradeOrder(0, null, tradeSide); // Clear Shares
				if (price === '') {
					trade.updateTradeOrder(null, price, tradeSide);
					trade.updateTradeOrder(null, null, tradeSide);
				} else {
					trade.updateTradeOrder(null, price, tradeSide);
				}
			} else {
				const shares = trade.totalSharesUpToOrder(orderIndex, side);

				trade.updateTradeOrder(shares, price, tradeSide);
			}

			this.updateSelectedTradeSide(tradeSide, outcomeID);
		}
	}

	// NOTE -- only called if a market is of type SCALAR from `componentWillMount`
	determineDefaultShareDenomination() {
		const marketID = getValue(this.props, 'market.id');
		const shareDenomination = getValue(this.props, `scalarShareDenomination.markets.${marketID}`);

		if (!shareDenomination) {
			const maxValue = getValue(this.props, 'market.maxValue');

			if (maxValue >= 10000000) {
				this.props.scalarShareDenomination.updateSelectedShareDenomination(marketID, MICRO_SHARE);
			} else if (maxValue >= 10000) {
				this.props.scalarShareDenomination.updateSelectedShareDenomination(marketID, MILLI_SHARE);
			} else {
				this.props.scalarShareDenomination.updateSelectedShareDenomination(marketID, SHARE);
			}
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		const marketID = getValue(p, 'market.id');
		const tradeSummary = getValue(p, 'market.tradeSummary');
		const submitTrade = getValue(p, 'market.onSubmitPlaceTrade');
		const marketType = getValue(p, 'market.type');
		const minValue = getValue(p, 'market.minValue');
		const maxValue = getValue(p, 'market.maxValue');

		const selectedShareDenomination = getValue(p, `scalarShareDenomination.markets.${marketID}`);
		const shareDenominations = getValue(p, 'scalarShareDenomination.denominations');
		const updateSelectedShareDenomination = getValue(p, 'scalarShareDenomination.updateSelectedShareDenomination');

		return (
			<article className="market-active">
				<div className="market-group">
					<MarketData
						{...p}
						marketID={marketID}
						marketType={marketType}
						selectedOutcome={s.selectedOutcome}
						updateSelectedOutcome={this.updateSelectedOutcome}
						selectedShareDenomination={selectedShareDenomination}
						shareDenominations={shareDenominations}
						updateSelectedShareDenomination={updateSelectedShareDenomination}
						tradeSummary={tradeSummary}
						submitTrade={(id) => { submitTrade(id); }}
						selectedTradeSide={s.selectedTradeSide}
						updateSelectedTradeSide={this.updateSelectedTradeSide}
						updateTradeFromSelectedOrder={this.updateTradeFromSelectedOrder}
						outcomeTradeNavItems={p.outcomeTradeNavItems}
						minLimitPrice={minValue}
						maxLimitPrice={maxValue}
					/>
					<OrderBook
						marketType={marketType}
						outcome={s.selectedOutcome}
						selectedTradeSide={s.selectedTradeSide}
						updateTradeFromSelectedOrder={this.updateTradeFromSelectedOrder}
						selectedShareDenomination={selectedShareDenomination}
					/>
				</div>
				{p.logged &&
					<div className="market-group">
						<MarketUserData
							{...p}
							marketType={marketType}
							navItems={p.marketUserDataNavItems}
							selectedShareDenomination={selectedShareDenomination}
						/>
						<OutcomeTrade
							marketType={marketType}
							selectedOutcome={s.selectedOutcome}
							tradeSummary={tradeSummary}
							submitTrade={(id) => { submitTrade(id); }}
							selectedTradeSide={s.selectedTradeSide}
							selectedShareDenomination={selectedShareDenomination}
							updateSelectedTradeSide={this.updateSelectedTradeSide}
							outcomeTradeNavItems={p.outcomeTradeNavItems}
							minLimitPrice={minValue}
							maxLimitPrice={maxValue}
						/>
					</div>
				}
			</article>
		);
	}
}

MarketActive.propTypes = {
	market: PropTypes.shape({
		outcomes: PropTypes.array
	}),
	scalarShareDenomination: PropTypes.shape({
		updateSelectedShareDenomination: PropTypes.func
	})
};
