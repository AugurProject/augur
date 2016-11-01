import React, { Component } from 'react';

import Input from 'modules/common/components/input';
import OutcomeTradeSummary from 'modules/outcomes/components/outcome-trade-summary';

import { BUY, SELL } from 'modules/outcomes/constants/trade-types';

import getValue from 'utils/get-value';

export default class OutcomeTrade extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timestamp: Date.now() // Utilized to force a re-render and subsequent update of the input fields' values
		};
	}

	componentWillReceiveProps(nextProps) {
		const oldTrade = JSON.stringify(getValue(this.props, 'selectedOutcome.trade'));
		const trade = JSON.stringify(getValue(nextProps, 'selectedOutcome.trade'));
		
		console.log('trade -- ', trade, oldTrade, trade !== oldTrade);

		if (trade !== oldTrade) {
			this.setState({ timestamp: Date.now() });
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

		return (
			<article className="outcome-trade">
				<h3>Create Order</h3>
				{name &&
					<span className="outcome-name">{name}</span>
				}
				{trade &&
					<div
						key={s.timestamp}
						className="outcome-trade-inputs"
					>
						<div className="outcome-trade-inputs-sides">
							<button onClick={() => { trade.updateTradeOrder(undefined, undefined, BUY); }} >
								Buy
							</button>
							<button onClick={() => { trade.updateTradeOrder(undefined, undefined, SELL); }} >
								Sell
							</button>
						</div>
						<Input
							type="number"
							step="0.1"
							value={trade.numShares}
							title={trade.limitPrice && trade.maxNumShares && `${trade.maxNumShares.minimized} shares max at this price`}
							min="0"
							max={trade.maxNumShares.value}
							onChange={(value) => { trade.updateTradeOrder(value, undefined, trade.side); }}
						/>
						<Input
							type="number"
							step="0.1"
							value={trade.limitPrice}
							onChange={(value) => { trade.updateTradeOrder(undefined, value, trade.side); }}
						/>
					</div>
				}
				{tradeOrder &&
					<OutcomeTradeSummary
						trade={trade}
						tradeOrder={tradeOrder}
					/>
				}
				{tradeOrder && hasFunds &&
					<div className="outcome-trade-actions" >
						<button
							onClick={() => {
								p.submitTrade();
							}}
						>
							Place Trade
						</button>
					</div>
				}
				{tradeOrder && !hasFunds &&
					<span>Insufficient Funds</span>
				}
			</article>
		);
	}
}

// const OutcomeTrade = (p) => {
// 	console.log('OutcomeTrade -- ', p);
//
// 	const selectedID = getValue(p, 'selectedOutcome.id');
// 	const name = getValue(p, 'selectedOutcome.name');
// 	const trade = getValue(p, 'selectedOutcome.trade');
// 	const tradeOrder = getValue(p, 'tradeSummary.tradeOrders').find(order => order.data.outcomeID === selectedID);
// 	const hasFunds = getValue(p, 'tradeSummary.hasUserEnoughFunds');
// 	const timestamp = Date.now(); // Forces a re-render of inputs so that the values are correctly updated
//
// 	console.log('TRADE INPUT VALUES OF SELECTED OUTCOME -- ', trade.numShares, trade.limitPrice);
//
// 	return (
// 		<article className="outcome-trade">
// 			<h3>Create Order</h3>
// 			{name &&
// 				<span className="outcome-name">{name}</span>
// 			}
// 			{trade &&
// 				<div
// 					key={timestamp}
// 					className="outcome-trade-inputs"
// 				>
// 					<div className="outcome-trade-inputs-sides">
// 						<button onClick={() => { trade.updateTradeOrder(undefined, undefined, BUY); }} >
// 							Buy
// 						</button>
// 						<button onClick={() => { trade.updateTradeOrder(undefined, undefined, SELL); }} >
// 							Sell
// 						</button>
// 					</div>
// 					<Input
// 						type="number"
// 						step="0.1"
// 						value={trade.numShares}
// 						title={trade.limitPrice && trade.maxNumShares && `${trade.maxNumShares.minimized} shares max at this price`}
// 						min="0"
// 						max={trade.maxNumShares}
// 						onChange={value => trade.updateTradeOrder(value, undefined, trade.side)}
// 					/>
// 					<Input
// 						type="number"
// 						step="0.1"
// 						value={trade.limitPrice}
// 						onChange={value => trade.updateTradeOrder(undefined, value, trade.side)}
// 					/>
// 				</div>
// 			}
// 			{tradeOrder &&
// 				<OutcomeTradeSummary
// 					trade={trade}
// 					tradeOrder={tradeOrder}
// 				/>
// 			}
// 			{tradeOrder && hasFunds &&
// 				<div className="outcome-trade-actions" >
// 					<button
// 						onClick={() => {
// 							p.submitTrade();
// 						}}
// 					>
// 						Place Trade
// 					</button>
// 				</div>
// 			}
// 			{tradeOrder && !hasFunds &&
// 				<span>Insufficient Funds</span>
// 			}
// 		</article>
// 	);
// };
//
// export default OutcomeTrade;
