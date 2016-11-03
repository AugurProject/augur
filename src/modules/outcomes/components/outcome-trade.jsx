import React, { Component } from 'react';

import Input from 'modules/common/components/input';
import OutcomeTradeSummary from 'modules/outcomes/components/outcome-trade-summary';
import OutcomeTradeAction from 'modules/outcomes/components/outcome-trade-action';
import ComponentNav from 'modules/common/components/component-nav';
import EmDash from 'modules/common/components/em-dash';

import { BUY, SELL } from 'modules/outcomes/constants/trade-types';
import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

export default class OutcomeTrade extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timestamp: Date.now(), // Utilized to force a re-render and subsequent update of the input fields' values
			selectedNav: BUY
		};

		this.updateSelectedNav = this.updateSelectedNav.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const oldTrade = JSON.stringify(getValue(this.props, 'selectedOutcome.trade'));
		const newTrade = JSON.stringify(getValue(nextProps, 'selectedOutcome.trade'));

		if (newTrade !== oldTrade) {
			this.setState({ timestamp: Date.now() });
		}
	}

	updateSelectedNav(selectedNav) {
		this.setState({ selectedNav });

		const trade = getValue(this.props, 'selectedOutcome.trade');
		if (trade && trade.updateTradeOrder) {
			trade.updateTradeOrder(undefined, undefined, selectedNav);
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		const selectedID = getValue(p, 'selectedOutcome.id');
		const name = getValue(p, 'selectedOutcome.name');
		const trade = getValue(p, 'selectedOutcome.trade');
		const tradeOrder = getValue(p, 'tradeSummary.tradeOrders').find(order => order.data.outcomeID === selectedID);
		const hasFunds = getValue(p, 'tradeSummary.hasUserEnoughFunds');
		const maxShares = getValue(trade, 'maxNumShares.value');

		return (
			<article className="outcome-trade">
				{!p.marketType === SCALAR ?
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
								selectedNav={s.selectedNav}
								updateSelectedNav={this.updateSelectedNav}
							/>
						</div>
						<div className="outcome-trade-inputs-fields">
							<Input
								placeholder="Quantity"
								type="number"
								step="0.1"
								value={trade.numShares}
								min="0"
								max={maxShares}
								onChange={(value) => { trade.updateTradeOrder(value, undefined, trade.side); }}
							/>
							<span>@</span>
							<Input
								placeholder="Price"
								type="number"
								step="0.1"
								value={trade.limitPrice}
								onChange={(value) => { trade.updateTradeOrder(undefined, value, trade.side); }}
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
