import React from 'react';

import Input from 'modules/common/components/input';
import OutcomeTradeSummary from 'modules/outcomes/components/outcome-trade-summary';

import getValue from 'utils/get-value';

const OutcomeTrade = (p) => {
	console.log('OutcomeTrade -- ', p);

	const name = getValue(p, 'selectedOutcome.name');
	const trade = getValue(p, 'selectedOutcome.trade');
	const tradeOrders = getValue(p, 'tradeSummary.tradeOrders');

	console.log('tradeOrders -- ', !!tradeOrders, tradeOrders);

	return (
		<article className="outcome-trade">
			<h3>Create Order</h3>
			{name &&
				<span className="outcome-name">{name}</span>
			}
			{trade &&
				<div className="outcome-trade-inputs">
					<Input
						type="number"
						step="0.1"
						value={trade.numShares}
						title={trade.limitPrice && trade.maxNumShares && `${trade.maxNumShares.minimized} shares max at this price`}
						min="0"
						max={trade.maxNumShares}
						onChange={value => trade.updateTradeOrder(value, undefined, trade.side)}
					/>
					<Input
						type="number"
						step="0.1"
						value={trade.limitPrice}
						onChange={value => trade.updateTradeOrder(undefined, value, trade.side)}
					/>
				</div>
			}
			{tradeOrders.length &&
				<OutcomeTradeSummary tradeOrders={tradeOrders} />
			}
			{tradeOrders.length &&
				<div className="outcome-trade-actions" >
					<button>Sell</button>
					<button>Buy</button>
				</div>
			}
		</article>
	);
};

export default OutcomeTrade;
