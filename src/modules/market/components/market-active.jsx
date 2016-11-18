import React, { Component, PropTypes } from 'react';

import MarketData from 'modules/market/components/market-data';
import MarketUserData from 'modules/market/components/market-user-data';
import OrderBook from 'modules/order-book/components/order-book';
import OutcomeTrade from 'modules/outcomes/components/outcome-trade';

import { SHARE, MILLI_SHARE, MICRO_SHARE } from 'modules/market/constants/share-denominations';
import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

export default class MarketActive extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOutcome: this.props.market.outcomes[0],
			selectedTradeSide: null
		};

		this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
		this.updateSelectedTradeSide = this.updateSelectedTradeSide.bind(this);
		this.determineDefaultShareDenomination = this.determineDefaultShareDenomination.bind(this);
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

	updateSelectedTradeSide(selectedTradeSide) {
		this.setState({ selectedTradeSide });
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
					/>
					<OrderBook
						marketType={marketType}
						outcome={s.selectedOutcome}
						selectedTradeSide={s.selectedTradeSide}
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
							selectedShareDenomination={selectedShareDenomination}
							updateSelectedTradeSide={this.updateSelectedTradeSide}
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
