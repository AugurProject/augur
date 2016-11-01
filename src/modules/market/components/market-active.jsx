import React, { Component, PropTypes } from 'react';

import MarketData from 'modules/market/components/market-data';
import MarketUserData from 'modules/market/components/market-user-data';
import OrderBook from 'modules/order-book/components/order-book';
import OutcomeTrade from 'modules/outcomes/components/outcome-trade';

import getValue from 'utils/get-value';

export default class MarketActive extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOutcome: this.props.market.outcomes[0]
		};

		this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
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

	render() {
		const p = this.props;
		const s = this.state;

		const tradeSummary = getValue(p, 'market.tradeSummary');
		const submitTrade = getValue(p, 'market.onSubmitPlaceTrade');

		return (
			<article className="market-active">
				<div className="market-group">
					<MarketData
						{...p}
						selectedOutcome={s.selectedOutcome}
						updateSelectedOutcome={this.updateSelectedOutcome}
					/>
					<OrderBook outcome={s.selectedOutcome} />
					{p.logged &&
						<OutcomeTrade
							selectedOutcome={s.selectedOutcome}
							tradeSummary={tradeSummary}
							submitTrade={(id) => { submitTrade(id); }}
						/>
					}
				</div>
				{p.logged &&
					<div className="market-group">
						<MarketUserData
							{...p}
							navItems={p.marketUserDataNavItems}
						/>
						<OutcomeTrade
							selectedOutcome={s.selectedOutcome}
							tradeSummary={tradeSummary}
							submitTrade={(id) => { submitTrade(id); }}
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
	})
};
