import React from 'react';

import Input from 'modules/common/components/input';
import OutcomeTradeSummary from 'modules/outcomes/components/outcome-trade-summary';

import get from 'utils/get';

const OutcomeTrade = (p) => {
	console.log('p -- ', p);

	const name = get(p, 'selectedOutcome.name');
	const trade = get(p, 'selectedOutcome.trade');
	const tradeOrders = get(p, 'selectedOutcome.trade.tradeSummary.tradeOrders');

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
			{tradeOrders &&
				<OutcomeTradeSummary tradeOrders={tradeOrders} />
			}
			{tradeOrders &&
				<div className="outcome-trade-actions" >
					<button>Sell</button>
					<button>Buy</button>
				</div>
			}
		</article>
	);
};

export default OutcomeTrade;
