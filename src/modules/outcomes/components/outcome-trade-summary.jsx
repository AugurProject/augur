import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';

import getValue from 'utils/get-value';

const OutcomeTradeSummary = (p) => {
	const tradingFees = getValue(p, 'tradeOrder.tradingFees');
	const feePercent = getValue(p, 'tradeOrder.feePercent');
	const gasFees = getValue(p, 'tradeOrder.gasFees');
	const totalCost = getValue(p, 'trade.totalCost');

	return (
		<article className="outcome-trade-summary">
			{tradingFees && feePercent &&
				<div className="outcome-trade-summary-group">
					<span>Fees:</span>
					<span><ValueDenomination formatted={p.tradeOrder.tradingFees.formatted} /> <span>ETH ({p.tradeOrder.feePercent.formatted}%)</span></span>
				</div>
			}
			{gasFees &&
				<div className="outcome-trade-summary-group">
					<span>Gas:</span>
					<span><ValueDenomination formatted={p.tradeOrder.gasFees.formatted} /><span>ETH</span></span>
				</div>
			}
			{totalCost &&
				<div className="outcome-trade-summary-group">
					<span>Total:</span>
					<span><ValueDenomination formatted={p.trade.totalCost.formatted} /><span>ETH</span></span>
				</div>
			}
		</article>
	);
};

export default OutcomeTradeSummary;
