import React, { Component } from 'react';

import MarketData from 'modules/market/components/market-data';
import MarketUserData from 'modules/market/components/market-user-data';
import OrderBook from 'modules/order-book/components/order-book';
import OutcomeTrade from 'modules/outcomes/components/outcome-trade';

export default class MarketActive extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOutcome: this.props.market.outcomes[0]
		};

		this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
	}

	updateSelectedOutcome(selectedOutcome) {
		this.setState({ selectedOutcome });
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<article className="market-active">
				<div className="market-group">
					<MarketData
						{...p}
						selectedOutcome={s.selectedOutcome}
						updateSelectedOutcome={this.updateSelectedOutcome}
					/>
					<OrderBook outcome={s.selectedOutcome} />
					<OutcomeTrade />
				</div>
				<div className="market-group">
					<MarketUserData />
					<OutcomeTrade />
				</div>
			</article>
		);
	}
}
